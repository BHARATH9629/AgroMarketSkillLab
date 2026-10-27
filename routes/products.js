// routes/products.js
const express = require('express');
const router  = express.Router();
const db      = require('../db');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// GET ALL
router.get('/', async (req, res) => {
  try {
    const { category, search, min_price, max_price, is_organic, sort, page=1, limit=12 } = req.query;
    const offset = (page-1)*limit;
    let q = `SELECT p.*,c.name AS category_name,u.full_name AS farmer_name,u.city,u.state,fp.farm_name,fp.farming_type,fp.rating AS farmer_rating FROM products p JOIN categories c ON p.category_id=c.id JOIN users u ON p.farmer_id=u.id LEFT JOIN farmer_profiles fp ON fp.user_id=u.id WHERE p.is_available=TRUE`;
    const params=[];
    if (category)            { q+=' AND c.name=?';                                     params.push(category); }
    if (search)              { q+=' AND (p.name LIKE ? OR p.description LIKE ?)';       params.push(`%${search}%`,`%${search}%`); }
    if (min_price)           { q+=' AND p.price_per_unit>=?';                           params.push(min_price); }
    if (max_price)           { q+=' AND p.price_per_unit<=?';                           params.push(max_price); }
    if (is_organic==='true') { q+=' AND p.is_organic=TRUE'; }
    q += sort==='price_asc' ? ' ORDER BY p.price_per_unit ASC' : sort==='price_desc' ? ' ORDER BY p.price_per_unit DESC' : sort==='rating' ? ' ORDER BY p.rating DESC' : ' ORDER BY p.created_at DESC';
    q += ' LIMIT ? OFFSET ?'; params.push(parseInt(limit), parseInt(offset));
    const [products] = await db.query(q, params);
    const [[{total}]] = await db.query('SELECT COUNT(*) AS total FROM products WHERE is_available=TRUE');
    res.json({ success:true, total, page:parseInt(page), pages:Math.ceil(total/limit), products });
  } catch(err) { res.status(500).json({ success:false, message:err.message }); }
});

// GET MY PRODUCTS (farmer or distributor)
router.get('/farmer/my-products', verifyToken, authorizeRoles('farmer', 'distributor', 'admin'), async (req, res) => {
  try {
    const [products] = await db.query(`SELECT p.*,c.name AS category_name FROM products p JOIN categories c ON p.category_id=c.id WHERE p.farmer_id=? ORDER BY p.created_at DESC`, [req.user.id]);
    res.json({ success:true, count:products.length, products });
  } catch(err) { res.status(500).json({ success:false, message:err.message }); }
});

// GET ONE
router.get('/:id', async (req, res) => {
  try {
    await db.query('UPDATE products SET views=views+1 WHERE id=?', [req.params.id]);
    const [products] = await db.query(`SELECT p.*,c.name AS category_name,u.full_name AS farmer_name,u.phone AS farmer_phone,u.city,u.state,fp.farm_name,fp.farming_type,fp.rating AS farmer_rating FROM products p JOIN categories c ON p.category_id=c.id JOIN users u ON p.farmer_id=u.id LEFT JOIN farmer_profiles fp ON fp.user_id=u.id WHERE p.id=?`, [req.params.id]);
    if (!products.length) return res.status(404).json({ success:false, message:'Product not found.' });
    const [reviews] = await db.query(`SELECT r.*,u.full_name AS reviewer_name FROM reviews r JOIN users u ON r.reviewer_id=u.id WHERE r.product_id=? ORDER BY r.created_at DESC LIMIT 5`, [req.params.id]);
    res.json({ success:true, product:products[0], reviews });
  } catch(err) { res.status(500).json({ success:false, message:err.message }); }
});

// CREATE (Only Farmers and Distributors/Company Sellers — NOT Buyers)
router.post('/', verifyToken, authorizeRoles('farmer', 'distributor', 'admin'), async (req, res) => {
  try {
    if (req.user.role === 'buyer') {
      return res.status(403).json({
        success: false,
        message: 'Buyers are not permitted to sell items. Only Farmers and Distributors/Company Sellers can list produce.'
      });
    }

    const { category_id,name,description,price_per_unit,unit,quantity_available,min_order_quantity,max_order_quantity,image_url,is_organic,harvest_date,expiry_date,grade } = req.body;
    if (!name||!price_per_unit||!quantity_available||!category_id) return res.status(400).json({ success:false, message:'Name, price, quantity and category required.' });
    const [r] = await db.query(`INSERT INTO products (farmer_id,category_id,name,description,price_per_unit,unit,quantity_available,min_order_quantity,max_order_quantity,image_url,is_organic,harvest_date,expiry_date,grade) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [req.user.id,category_id,name,description,price_per_unit,unit||'kg',quantity_available,min_order_quantity||1,max_order_quantity||null,image_url,is_organic||false,harvest_date||null,expiry_date||null,grade||'A']);
    res.status(201).json({ success:true, message:'Product listed!', productId:r.insertId });
  } catch(err) { res.status(500).json({ success:false, message:err.message }); }
});

// UPDATE
router.put('/:id', verifyToken, authorizeRoles('farmer', 'distributor', 'admin'), async (req, res) => {
  try {
    const [products] = await db.query('SELECT farmer_id FROM products WHERE id=?', [req.params.id]);
    if (!products.length) return res.status(404).json({ success:false, message:'Not found.' });
    if (products[0].farmer_id!==req.user.id && req.user.role!=='admin') return res.status(403).json({ success:false, message:'Not authorized.' });
    const { name,description,price_per_unit,unit,quantity_available,image_url,is_organic,grade,is_available } = req.body;
    await db.query('UPDATE products SET name=?,description=?,price_per_unit=?,unit=?,quantity_available=?,image_url=?,is_organic=?,grade=?,is_available=? WHERE id=?',
      [name,description,price_per_unit,unit,quantity_available,image_url,is_organic,grade,is_available,req.params.id]);
    res.json({ success:true, message:'Product updated!' });
  } catch(err) { res.status(500).json({ success:false, message:err.message }); }
});

// DELETE
router.delete('/:id', verifyToken, authorizeRoles('farmer', 'distributor', 'admin'), async (req, res) => {
  try {
    const [products] = await db.query('SELECT farmer_id FROM products WHERE id=?', [req.params.id]);
    if (!products.length) return res.status(404).json({ success:false, message:'Not found.' });
    if (products[0].farmer_id!==req.user.id && req.user.role!=='admin') return res.status(403).json({ success:false, message:'Not authorized.' });
    await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ success:true, message:'Product deleted.' });
  } catch(err) { res.status(500).json({ success:false, message:err.message }); }
});

// TOGGLE availability
router.patch('/:id/toggle', verifyToken, async (req, res) => {
  try {
    await db.query('UPDATE products SET is_available=NOT is_available WHERE id=? AND farmer_id=?', [req.params.id, req.user.id]);
    res.json({ success:true, message:'Toggled.' });
  } catch(err) { res.status(500).json({ success:false, message:err.message }); }
});

module.exports = router;