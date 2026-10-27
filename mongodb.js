// mongodb.js — MongoDB Connection (Mongoose) for Analytics & Logs
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrimarket_analytics';

// ── Connect ──
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected to agrimarket_analytics!'))
  .catch(err => console.error('❌ MongoDB connection failed:', err.message));

// ── Schemas ──

// 1. AI Chat History
const chatHistorySchema = new mongoose.Schema({
  userId:    { type: Number, default: null },
  userName:  { type: String, default: 'Guest' },
  message:   { type: String, required: true },
  reply:     { type: String, required: true },
  category:  { type: String, default: 'general' }, // crop, price, farming, general
  sentiment: { type: String, default: 'neutral' },  // positive, negative, neutral
  responseTimeMs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// 2. Search History (what users search)
const searchHistorySchema = new mongoose.Schema({
  userId:    { type: Number, default: null },
  query:     { type: String, required: true },
  results:   { type: Number, default: 0 },
  category:  { type: String, default: '' },
  clicked:   { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// 3. Page/Product View Analytics
const viewAnalyticsSchema = new mongoose.Schema({
  userId:    { type: Number, default: null },
  productId: { type: Number, default: null },
  productName: { type: String, default: '' },
  page:      { type: String, default: 'home' },
  action:    { type: String, default: 'view' }, // view, click, add_cart, purchase
  duration:  { type: Number, default: 0 },       // seconds on page
  device:    { type: String, default: 'desktop' },
  ip:        { type: String, default: '' },
  userAgent: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// 4. Price History Tracker (for AI trend analysis)
const priceTrackerSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category:    { type: String, default: '' },
  price:       { type: Number, required: true },
  unit:        { type: String, default: 'kg' },
  source:      { type: String, default: 'ai_suggestion' }, // ai_suggestion, manual, mandi
  region:      { type: String, default: 'India' },
  createdAt:   { type: Date, default: Date.now }
});

// 5. User Activity Feed
const activityFeedSchema = new mongoose.Schema({
  userId:     { type: Number, required: true },
  userName:   { type: String, default: '' },
  action:     { type: String, required: true }, // login, register, post_product, order, review, chat
  details:    { type: mongoose.Schema.Types.Mixed, default: {} },
  ip:         { type: String, default: '' },
  createdAt:  { type: Date, default: Date.now }
});

// 6. AI Crop Recommendations Log
const cropRecommendationSchema = new mongoose.Schema({
  userId:       { type: Number, default: null },
  state:        { type: String, required: true },
  season:       { type: String, default: 'Kharif' },
  soil:         { type: String, default: '' },
  water:        { type: String, default: '' },
  recommendations: { type: Array, default: [] },
  feedback:     { type: String, default: '' }, // helpful, not_helpful, neutral
  createdAt:    { type: Date, default: Date.now }
});

// 7. Contact Form Submissions (MongoDB for flexible docs)
const contactSubmissionSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true },
  message:    { type: String, required: true },
  status:     { type: String, default: 'new' },  // new, read, replied
  repliedBy:  { type: Number, default: null },
  repliedAt:  { type: Date, default: null },
  createdAt:  { type: Date, default: Date.now }
});

// ── Models ──
const ChatHistory        = mongoose.model('ChatHistory', chatHistorySchema);
const SearchHistory      = mongoose.model('SearchHistory', searchHistorySchema);
const ViewAnalytics      = mongoose.model('ViewAnalytics', viewAnalyticsSchema);
const PriceTracker       = mongoose.model('PriceTracker', priceTrackerSchema);
const ActivityFeed       = mongoose.model('ActivityFeed', activityFeedSchema);
const CropRecommendation = mongoose.model('CropRecommendation', cropRecommendationSchema);
const ContactSubmission  = mongoose.model('ContactSubmission', contactSubmissionSchema);

module.exports = {
  mongoose,
  ChatHistory,
  SearchHistory,
  ViewAnalytics,
  PriceTracker,
  ActivityFeed,
  CropRecommendation,
  ContactSubmission
};
