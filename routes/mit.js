// routes/mit.js — MIT App Inventor API
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/mit/order/:id
router.get('/order/:id', async (req, res) => {
  console.log(`📱 [MIT App Request] IP: ${req.ip} | ID param: "${req.params.id}" | Time: ${new Date().toLocaleTimeString()}`);
  try {
    // Clean order id (handle "ORD-1", "#1", or "1")
    const rawId = req.params.id.trim();
    const cleanId = rawId.replace(/[^0-9]/g, '');

    if (!cleanId) {
      const msg = `⚠️ Invalid Order ID "${rawId}". Please enter a valid number (e.g. 1).`;
      if (req.query.format === 'json') {
        return res.json({ success: false, result: msg });
      }
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.send(msg);
    }

    const [orders] = await db.query(`
      SELECT o.id, o.status, o.total_amount,
             o.payment_status, o.payment_method,
             o.created_at, o.expected_delivery,
             u.full_name AS buyer_name,
             u.phone AS buyer_phone,
             COUNT(oi.id) AS item_count,
             GROUP_CONCAT(CONCAT(p.name, ' (', oi.quantity, ' ', p.unit, ')') SEPARATOR ', ') AS item_names
      FROM orders o
      JOIN users u ON o.buyer_id = u.id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
      GROUP BY o.id
    `, [cleanId]);

    if (!orders.length) {
      const notFoundMsg = `⚠️ Order #${cleanId} not found.\nPlease verify your Order ID (e.g. 1) and try again.`;
      if (req.query.format === 'json') {
        return res.json({ success: false, result: notFoundMsg });
      }
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.send(notFoundMsg);
    }

    const o = orders[0];
    const statusEmoji = {
      pending: '⏳ PENDING',
      processing: '⚙️ PROCESSING',
      shipped: '🚚 SHIPPED',
      dispatched: '🚚 DISPATCHED',
      delivered: '✅ DELIVERED',
      cancelled: '❌ CANCELLED'
    }[o.status.toLowerCase()] || o.status.toUpperCase();

    const formattedDate = new Date(o.created_at).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    const deliveryDate = o.expected_delivery
      ? new Date(o.expected_delivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'In Transit / Pending';

    const result =
      `🌾 AgroMarket Order Status 🌾\n` +
      `─────────────────────────\n` +
      `📦 Order ID : ORD-${o.id}\n` +
      `📊 Status   : ${statusEmoji}\n` +
      `💰 Amount   : ₹${parseFloat(o.total_amount).toFixed(2)}\n` +
      `💳 Payment  : ${o.payment_status.toUpperCase()} (${(o.payment_method || 'UPI').toUpperCase()})\n` +
      `👤 Buyer    : ${o.buyer_name}\n` +
      `🌱 Items    : ${o.item_names || (o.item_count + ' item(s)')}\n` +
      `📅 Date     : ${formattedDate}\n` +
      `🚚 Delivery : ${deliveryDate}\n` +
      `─────────────────────────\n` +
      `AgroMarket · Smart Farming`;

    if (req.query.format === 'json') {
      return res.json({ success: true, result, order: o });
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(result);

  } catch (err) {
    const errMsg = 'Server error: ' + err.message;
    if (req.query.format === 'json') {
      return res.status(500).json({ success: false, result: errMsg });
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(500).send(errMsg);
  }
});

// GET /api/mit/test or /api/mit - Quick connectivity check
router.get(['/', '/test', '/ping'], (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send('✅ AgroMarket MIT App Server Connected!\nTrack orders at: /api/mit/order/:id\nExample: /api/mit/order/1');
});

module.exports = router;