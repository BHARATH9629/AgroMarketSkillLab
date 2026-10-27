// routes/admin.js — Special Admin Powers & Full System Governance
const express = require('express');
const router  = express.Router();
const db      = require('../db');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const os      = require('os');
const mongo   = require('../mongodb');

// Require Admin authorization for all admin endpoints
router.use(verifyToken, authorizeRoles('admin'));

/* ── 1. USER MANAGEMENT (Special Powers) ───────────────────── */
// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.role, u.city, u.state, u.is_verified, u.is_active, u.created_at,
              fp.farm_name, dp.company_name, bp.business_name
       FROM users u
       LEFT JOIN farmer_profiles fp ON u.id = fp.user_id
       LEFT JOIN distributor_profiles dp ON u.id = dp.user_id
       LEFT JOIN buyer_profiles bp ON u.id = bp.user_id
       ORDER BY u.created_at DESC`
    );
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/users/:id/toggle-status (Ban / Unban)
router.patch('/users/:id/toggle-status', async (req, res) => {
  try {
    const [users] = await db.query('SELECT is_active, email FROM users WHERE id=?', [req.params.id]);
    if (!users.length) return res.status(404).json({ success: false, message: 'User not found' });
    const newStatus = !users[0].is_active;
    await db.query('UPDATE users SET is_active=? WHERE id=?', [newStatus, req.params.id]);
    
    // Log to MongoDB
    if (mongo.ActivityFeed) {
      mongo.ActivityFeed.create({
        userId: req.user.id,
        userName: req.user.email,
        action: newStatus ? 'admin_unban_user' : 'admin_ban_user',
        details: { targetUserId: req.params.id, targetEmail: users[0].email }
      }).catch(() => {});
    }

    res.json({ success: true, message: `User status changed to ${newStatus ? 'Active' : 'Banned'}`, is_active: newStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/users/:id/toggle-verify (KYC / Verified Badge)
router.patch('/users/:id/toggle-verify', async (req, res) => {
  try {
    const [users] = await db.query('SELECT is_verified FROM users WHERE id=?', [req.params.id]);
    if (!users.length) return res.status(404).json({ success: false, message: 'User not found' });
    const newStatus = !users[0].is_verified;
    await db.query('UPDATE users SET is_verified=? WHERE id=?', [newStatus, req.params.id]);
    res.json({ success: true, message: `User verification updated to ${newStatus ? 'Verified' : 'Unverified'}`, is_verified: newStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/users/:id/role (Change Role)
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['farmer', 'buyer', 'distributor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    await db.query('UPDATE users SET role=? WHERE id=?', [role, req.params.id]);
    res.json({ success: true, message: `Role successfully changed to ${role}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Admin cannot delete themselves' });
    }
    await db.query('DELETE FROM users WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'User deleted from system' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 2. PRODUCT GOVERNANCE (Special Powers) ────────────────── */
// GET /api/admin/products
router.get('/products', async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, c.name AS category_name, u.full_name AS farmer_name, u.email AS farmer_email, u.role AS seller_role
       FROM products p
       JOIN categories c ON p.category_id = c.id
       JOIN users u ON p.farmer_id = u.id
       ORDER BY p.created_at DESC`
    );
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/products/:id/toggle-availability
router.patch('/products/:id/toggle-availability', async (req, res) => {
  try {
    const [products] = await db.query('SELECT is_available, name FROM products WHERE id=?', [req.params.id]);
    if (!products.length) return res.status(404).json({ success: false, message: 'Product not found' });
    const newStatus = !products[0].is_available;
    await db.query('UPDATE products SET is_available=? WHERE id=?', [newStatus, req.params.id]);
    res.json({ success: true, message: `Product availability toggled to ${newStatus ? 'Listed' : 'Taken Down'}`, is_available: newStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Product removed by Administrator' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 3. ORDER OVERRIDE & AUDIT ────────────────────────────── */
// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.full_name AS buyer_name, u.email AS buyer_email, u.phone AS buyer_phone
       FROM orders o
       JOIN users u ON o.buyer_id = u.id
       ORDER BY o.created_at DESC`
    );
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/orders/:id/status (Override order and payment status)
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status, payment_status } = req.body;
    const updates = [];
    const params = [];
    if (status) { updates.push('status=?'); params.push(status); }
    if (payment_status) { updates.push('payment_status=?'); params.push(payment_status); }
    if (!updates.length) return res.status(400).json({ success: false, message: 'Nothing to update' });
    params.push(req.params.id);

    await db.query(`UPDATE orders SET ${updates.join(', ')} WHERE id=?`, params);
    res.json({ success: true, message: 'Order status updated by Administrator' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 4. EMERGENCY SYSTEM BROADCAST ────────────────────────── */
// POST /api/admin/broadcast (Send alert banner to all users)
router.post('/broadcast', async (req, res) => {
  try {
    const { title, message, type } = req.body;
    if (!title || !message) return res.status(400).json({ success: false, message: 'Title and message required' });

    const [users] = await db.query('SELECT id FROM users');
    for (const u of users) {
      await db.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [u.id, `📢 ${title}`, message, type || 'system']
      );
    }

    res.json({ success: true, message: `Broadcast dispatched to ${users.length} users successfully!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 5. SYSTEM TELEMETRY (Hardware, DBs, Collections) ─────── */
// GET /api/admin/system
router.get('/system', async (req, res) => {
  try {
    const [uCount] = await db.query('SELECT COUNT(*) AS total FROM users');
    const [pCount] = await db.query('SELECT COUNT(*) AS total FROM products');
    const [oCount] = await db.query('SELECT COUNT(*) AS total FROM orders');
    const [payCount] = await db.query('SELECT COUNT(*) AS total FROM payments');
    const [cCount] = await db.query('SELECT COUNT(*) AS total FROM categories');

    let mongoStats = { connected: false };
    if (mongo.mongoose && (mongo.mongoose.connection.readyState === 1 || mongo.mongoose.connection.readyState === 2)) {
      const [vCount, sCount, chCount, actCount, ctCount, crCount, prCount] = await Promise.all([
        mongo.ViewAnalytics.countDocuments(),
        mongo.SearchHistory.countDocuments(),
        mongo.ChatHistory.countDocuments(),
        mongo.ActivityFeed.countDocuments(),
        mongo.ContactSubmission.countDocuments(),
        mongo.CropRecommendation.countDocuments(),
        mongo.PriceTracker.countDocuments()
      ]);
      mongoStats = {
        connected: true,
        database: 'agrimarket_analytics',
        views: vCount,
        searches: sCount,
        chats: chCount,
        activities: actCount,
        contacts: ctCount,
        cropRecs: crCount,
        prices: prCount
      };
    }

    res.json({
      success: true,
      system: {
        nodeVersion: process.version,
        platform: os.platform(),
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsageMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
        totalMemoryMb: Math.round(os.totalmem() / (1024 * 1024)),
        freeMemoryMb: Math.round(os.freemem() / (1024 * 1024))
      },
      mysql: {
        database: 'agriproject_db',
        users: uCount[0].total,
        products: pCount[0].total,
        orders: oCount[0].total,
        payments: payCount[0].total,
        categories: cCount[0].total
      },
      mongodb: mongoStats
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 6. DIRECT MONGODB COLLECTION BROWSER ──────────────────── */
// GET /api/admin/mongodb/:collection
router.get('/mongodb/:collection', async (req, res) => {
  try {
    const collName = req.params.collection;
    let model = null;
    if (collName === 'chats')      model = mongo.ChatHistory;
    if (collName === 'searches')   model = mongo.SearchHistory;
    if (collName === 'views')      model = mongo.ViewAnalytics;
    if (collName === 'activities') model = mongo.ActivityFeed;
    if (collName === 'contacts')   model = mongo.ContactSubmission;
    if (collName === 'crops')      model = mongo.CropRecommendation;
    if (collName === 'prices')     model = mongo.PriceTracker;

    if (!model) return res.status(404).json({ success: false, message: 'Collection model not found' });
    const docs = await model.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: docs.length, collection: collName, docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/mongodb/:collection (Purge logs)
router.delete('/mongodb/:collection', async (req, res) => {
  try {
    const collName = req.params.collection;
    let model = null;
    if (collName === 'chats')      model = mongo.ChatHistory;
    if (collName === 'searches')   model = mongo.SearchHistory;
    if (collName === 'views')      model = mongo.ViewAnalytics;
    if (collName === 'activities') model = mongo.ActivityFeed;
    if (collName === 'contacts')   model = mongo.ContactSubmission;

    if (!model) return res.status(404).json({ success: false, message: 'Collection model not found' });
    await model.deleteMany({});
    res.json({ success: true, message: `Collection ${collName} purged successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
