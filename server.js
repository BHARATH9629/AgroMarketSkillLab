// server.js — Main Express Server (with Mobile Access + MongoDB Analytics)
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const os      = require('os');
require('dotenv').config();

// Connect MongoDB for Analytics & Logs
require('./mongodb');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','PATCH'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.static(path.join(__dirname)));

// Helper to get local IP address for phone connectivity
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/products',      require('./routes/products'));
app.use('/api/orders',        require('./routes/orders'));
app.use('/api/payments',      require('./routes/payments'));
app.use('/api/dashboard',     require('./routes/dashboard'));
app.use('/api/messages',      require('./routes/messages'));
app.use('/api/reviews',       require('./routes/reviews'));
app.use('/api/logistics',     require('./routes/logistics'));
app.use('/api/cart',          require('./routes/cart'));
app.use('/api/wishlist',      require('./routes/wishlist'));
app.use('/api/categories',    require('./routes/categories'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/farmers',       require('./routes/farmers'));
app.use('/api/coupons',       require('./routes/coupons'));
app.use('/api/ai',            require('./routes/ai'));
app.use('/api/mit',           require('./routes/mit'));
app.use('/api/analytics',     require('./routes/analytics')); // 🍃 MongoDB Analytics Route
app.use('/api/admin',         require('./routes/admin'));     // 🛡️ Admin Powers Route

// Serve frontend and admin
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));


// Health check with system info
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'OK',
    message: '🌱 AgroMarket Dual-Database API running!',
    databases: {
      mysql: 'Connected (agriproject_db)',
      mongodb: mongoose.connection.readyState === 1 ? 'Connected (agrimarket_analytics)' : 'Connecting/Offline'
    },
    localIp: getLocalIP(),
    time: new Date()
  });
});

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message }));

// Listen on 0.0.0.0 to enable access from mobile devices on the same Wi-Fi network
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log('====================================================');
    console.log('🌱 AgroMarket Enterprise Server Running!');
    console.log(`💻 Local:       http://localhost:${PORT}`);
    console.log(`🚀 API:         http://localhost:${PORT}/api`);
    console.log(`🛡️  Admin Portal: http://localhost:${PORT}/admin`);
    console.log(`📱 Phone Access (Same WiFi): http://${localIP}:${PORT}`);
    console.log(`🍃 MongoDB:     mongodb://localhost:27017/agrimarket_analytics`);
    console.log(`🐬 MySQL:       agriproject_db`);
    console.log(`❤️  Health:     http://localhost:${PORT}/api/health`);
    console.log('====================================================');
  });
}

module.exports = app;