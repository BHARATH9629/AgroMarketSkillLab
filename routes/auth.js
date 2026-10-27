// routes/auth.js
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../db');
const { verifyToken } = require('../middleware/auth');
require('dotenv').config();

const genToken = (u) => jwt.sign({ id: u.id, email: u.email, role: u.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password, phone, role, city, state, address, pincode, farm_name, farming_type, business_name, business_type, company_name } = req.body;
    if (!full_name || !email || !password || !role) return res.status(400).json({ success: false, message: 'All fields required.' });

    const [ex] = await db.query('SELECT id FROM users WHERE email=?', [email]);
    if (ex.length) return res.status(409).json({ success: false, message: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const [r] = await db.query(
      'INSERT INTO users (full_name,email,password,phone,role,city,state,address,pincode) VALUES (?,?,?,?,?,?,?,?,?)',
      [full_name, email, hashed, phone||'', role, city||'', state||'', address||'', pincode||'']
    );
    const uid = r.insertId;

    if (role === 'farmer')
      await db.query('INSERT INTO farmer_profiles (user_id,farm_name,farming_type) VALUES (?,?,?)', [uid, farm_name||'', farming_type||'conventional']);
    else if (role === 'buyer')
      await db.query('INSERT INTO buyer_profiles (user_id,business_name,business_type) VALUES (?,?,?)', [uid, business_name||'', business_type||'individual']);
    else if (role === 'distributor')
      await db.query('INSERT INTO distributor_profiles (user_id,company_name) VALUES (?,?)', [uid, company_name||'']);

    await db.query('INSERT INTO notifications (user_id,title,message,type) VALUES (?,?,?,?)',
      [uid, 'Welcome to AgroMarket! 🌱', `Hello ${full_name}, your account is ready!`, 'system']);

    const token = genToken({ id: uid, email, role });
    res.status(201).json({ success: true, message: 'Registered successfully!', token, user: { id: uid, full_name, email, role } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required.' });

    const [users] = await db.query('SELECT * FROM users WHERE email=?', [email]);
    if (!users.length) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const user = users[0];
    if (!user.is_active) return res.status(403).json({ success: false, message: 'Account deactivated.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const token = genToken(user);
    res.json({ success: true, message: 'Login successful!', token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, city: user.city, state: user.state } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PROFILE
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id,full_name,email,phone,role,city,state,address,pincode,profile_image,is_verified,created_at FROM users WHERE id=?', [req.user.id]);
    if (!users.length) return res.status(404).json({ success: false, message: 'User not found.' });
    const user = users[0];
    let profile = {};
    if (user.role === 'farmer') { const [fp] = await db.query('SELECT * FROM farmer_profiles WHERE user_id=?', [user.id]); profile = fp[0]||{}; }
    else if (user.role === 'buyer') { const [bp] = await db.query('SELECT * FROM buyer_profiles WHERE user_id=?', [user.id]); profile = bp[0]||{}; }
    else if (user.role === 'distributor') { const [dp] = await db.query('SELECT * FROM distributor_profiles WHERE user_id=?', [user.id]); profile = dp[0]||{}; }
    res.json({ success: true, user: { ...user, profile } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// UPDATE PROFILE
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { full_name, phone, city, state, address, pincode } = req.body;
    await db.query('UPDATE users SET full_name=?,phone=?,city=?,state=?,address=?,pincode=? WHERE id=?',
      [full_name, phone, city, state, address, pincode, req.user.id]);
    res.json({ success: true, message: 'Profile updated!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// CHANGE PASSWORD
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const [users] = await db.query('SELECT password FROM users WHERE id=?', [req.user.id]);
    const ok = await bcrypt.compare(current_password, users[0].password);
    if (!ok) return res.status(400).json({ success: false, message: 'Current password incorrect.' });
    const hashed = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password=? WHERE id=?', [hashed, req.user.id]);
    res.json({ success: true, message: 'Password changed!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ALL USERS (Admin)
router.get('/all-users', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin only.' });
    const [users] = await db.query('SELECT id,full_name,email,role,phone,city,state,is_verified,is_active,created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, count: users.length, users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;