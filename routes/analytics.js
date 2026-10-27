// routes/analytics.js — MongoDB Analytics & Logging Endpoints
const express = require('express');
const router  = express.Router();
const {
  ChatHistory,
  SearchHistory,
  ViewAnalytics,
  PriceTracker,
  ActivityFeed,
  CropRecommendation,
  ContactSubmission
} = require('../mongodb');

// Helper to check MongoDB connection state (1 = connected, 2 = connecting)
function isMongoConnected() {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2;
}

/* ── 1. LOG PAGE / PRODUCT VIEW ────────────────────────── */
// POST /api/analytics/view
router.post('/view', async (req, res) => {
  try {
    if (!isMongoConnected()) return res.json({ success: true, logged: false, reason: 'MongoDB offline' });
    const { userId, productId, productName, page, action, duration, device } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const view = await ViewAnalytics.create({
      userId: userId || null,
      productId: productId || null,
      productName: productName || '',
      page: page || 'home',
      action: action || 'view',
      duration: duration || 0,
      device: device || (userAgent.toLowerCase().includes('mobile') ? 'mobile' : 'desktop'),
      ip,
      userAgent
    });

    res.json({ success: true, id: view._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 2. LOG SEARCH QUERY ────────────────────────────────── */
// POST /api/analytics/search
router.post('/search', async (req, res) => {
  try {
    if (!isMongoConnected()) return res.json({ success: true, logged: false });
    const { userId, query, results, category } = req.body;
    if (!query) return res.status(400).json({ success: false, message: 'Query required' });

    const search = await SearchHistory.create({
      userId: userId || null,
      query: query.trim(),
      results: results || 0,
      category: category || ''
    });

    res.json({ success: true, id: search._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 3. LOG & RETRIEVE ACTIVITY FEED ─────────────────────── */
// POST /api/analytics/activity
router.post('/activity', async (req, res) => {
  try {
    if (!isMongoConnected()) return res.json({ success: true, logged: false });
    const { userId, userName, action, details } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const act = await ActivityFeed.create({
      userId: userId || 0,
      userName: userName || 'User',
      action,
      details: details || {},
      ip
    });

    res.json({ success: true, id: act._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/activity — Recent 20 activities
router.get('/activity', async (req, res) => {
  try {
    if (!isMongoConnected()) return res.json({ success: true, activities: [] });
    const activities = await ActivityFeed.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, activities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 4. AGGREGATE STATS (For Admin & Dashboard) ───────────── */
// GET /api/analytics/stats
router.get('/stats', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.json({
        success: true,
        connected: false,
        stats: { totalViews: 0, totalSearches: 0, totalChats: 0, totalRecommendations: 0, topProducts: [], topSearches: [], devices: [] }
      });
    }

    const [totalViews, totalSearches, totalChats, totalRecommendations, totalContacts] = await Promise.all([
      ViewAnalytics.countDocuments(),
      SearchHistory.countDocuments(),
      ChatHistory.countDocuments(),
      CropRecommendation.countDocuments(),
      ContactSubmission.countDocuments()
    ]);

    // Top searched queries
    const topSearches = await SearchHistory.aggregate([
      { $group: { _id: '$query', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    // Top viewed products
    const topProducts = await ViewAnalytics.aggregate([
      { $match: { productName: { $ne: '' } } },
      { $group: { _id: '$productName', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 6 }
    ]);

    // Device breakdown
    const devices = await ViewAnalytics.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      connected: true,
      stats: {
        totalViews,
        totalSearches,
        totalChats,
        totalRecommendations,
        totalContacts,
        topSearches: topSearches.map(s => ({ query: s._id, count: s.count })),
        topProducts: topProducts.map(p => ({ name: p._id, views: p.views })),
        devices: devices.map(d => ({ device: d._id, count: d.count }))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 5. AI CHAT LOGS ─────────────────────────────────────── */
// GET /api/analytics/chats
router.get('/chats', async (req, res) => {
  try {
    if (!isMongoConnected()) return res.json({ success: true, chats: [] });
    const chats = await ChatHistory.find().sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, chats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 6. CONTACT SUBMISSIONS ──────────────────────────────── */
// POST /api/analytics/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    let id = null;
    if (isMongoConnected()) {
      const sub = await ContactSubmission.create({ name, email, message });
      id = sub._id;
    }

    res.json({ success: true, message: 'Feedback received and saved to MongoDB!', id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/contacts
router.get('/contacts', async (req, res) => {
  try {
    if (!isMongoConnected()) return res.json({ success: true, contacts: [] });
    const contacts = await ContactSubmission.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 7. CROP RECOMMENDATIONS LOGS ────────────────────────── */
// GET /api/analytics/crop-recs
router.get('/crop-recs', async (req, res) => {
  try {
    if (!isMongoConnected()) return res.json({ success: true, recommendations: [] });
    const recommendations = await CropRecommendation.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, recommendations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 8. PRICE TRENDS ─────────────────────────────────────── */
// GET /api/analytics/price-trends
router.get('/price-trends', async (req, res) => {
  try {
    if (!isMongoConnected()) return res.json({ success: true, trends: [] });
    const trends = await PriceTracker.find().sort({ createdAt: -1 }).limit(40);
    res.json({ success: true, trends });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
