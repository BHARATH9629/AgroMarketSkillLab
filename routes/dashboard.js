const express=require('express'),router=express.Router(),db=require('../db'),{verifyToken,authorizeRoles}=require('../middleware/auth');
router.get('/admin',verifyToken,authorizeRoles('admin'),async(req,res)=>{
  try{
    const[[{farmers}]]=await db.query("SELECT COUNT(*) AS farmers FROM users WHERE role='farmer'");
    const[[{buyers}]]=await db.query("SELECT COUNT(*) AS buyers FROM users WHERE role='buyer'");
    const[[{distributors}]]=await db.query("SELECT COUNT(*) AS distributors FROM users WHERE role='distributor'");
    const[[{products}]]=await db.query("SELECT COUNT(*) AS products FROM products");
    const[[{orders}]]=await db.query("SELECT COUNT(*) AS orders FROM orders");
    const[[{revenue}]]=await db.query("SELECT COALESCE(SUM(amount),0) AS revenue FROM payments WHERE status='success'");
    const[[{pending}]]=await db.query("SELECT COUNT(*) AS pending FROM orders WHERE status='pending'");
    const[recentOrders]=await db.query("SELECT o.*,u.full_name AS buyer_name FROM orders o JOIN users u ON o.buyer_id=u.id ORDER BY o.created_at DESC LIMIT 5");
    const[categoryStats]=await db.query("SELECT c.name,COUNT(p.id) AS count FROM categories c LEFT JOIN products p ON c.id=p.category_id GROUP BY c.id,c.name ORDER BY count DESC");
    const[topProducts]=await db.query("SELECT p.name,p.total_sold,p.price_per_unit,p.rating FROM products p ORDER BY p.total_sold DESC LIMIT 5");
    res.json({success:true,stats:{farmers,buyers,distributors,products,orders,revenue,pending},recentOrders,categoryStats,topProducts});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.get('/farmer',verifyToken,authorizeRoles('farmer','distributor','admin'),async(req,res)=>{
  try{
    const[[{myProducts}]]=await db.query('SELECT COUNT(*) AS myProducts FROM products WHERE farmer_id=?',[req.user.id]);
    const[[{totalSold}]]=await db.query('SELECT COALESCE(SUM(total_sold),0) AS totalSold FROM products WHERE farmer_id=?',[req.user.id]);
    const[[{myOrders}]]=await db.query('SELECT COUNT(*) AS myOrders FROM order_items WHERE farmer_id=?',[req.user.id]);
    const[[{revenue}]]=await db.query("SELECT COALESCE(SUM(oi.total_price),0) AS revenue FROM order_items oi JOIN orders o ON oi.order_id=o.id WHERE oi.farmer_id=? AND o.payment_status='paid'",[req.user.id]);
    const[recentOrders]=await db.query(`
      SELECT oi.*, p.name AS product_name, p.image_url, p.unit,
             o.id AS order_id, o.status AS order_status, o.payment_status, o.payment_method,
             o.delivery_address, o.delivery_city, o.delivery_state, o.delivery_pincode, o.created_at,
             u.full_name AS buyer_name, u.phone AS buyer_phone, u.email AS buyer_email
      FROM order_items oi
      JOIN products p ON oi.product_id=p.id
      JOIN orders o ON oi.order_id=o.id
      JOIN users u ON o.buyer_id=u.id
      WHERE oi.farmer_id=?
      ORDER BY o.created_at DESC LIMIT 20
    `,[req.user.id]);
    res.json({success:true,stats:{myProducts,totalSold,myOrders,revenue},recentOrders});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.get('/buyer',verifyToken,authorizeRoles('buyer'),async(req,res)=>{
  try{
    const[[{totalOrders}]]=await db.query('SELECT COUNT(*) AS totalOrders FROM orders WHERE buyer_id=?',[req.user.id]);
    const[[{totalSpent}]]=await db.query("SELECT COALESCE(SUM(total_amount),0) AS totalSpent FROM orders WHERE buyer_id=? AND payment_status='paid'",[req.user.id]);
    const[[{pendingOrders}]]=await db.query("SELECT COUNT(*) AS pendingOrders FROM orders WHERE buyer_id=? AND status='pending'",[req.user.id]);
    const[[{wishlistCount}]]=await db.query('SELECT COUNT(*) AS wishlistCount FROM wishlist WHERE user_id=?',[req.user.id]);
    const[recentOrders]=await db.query('SELECT * FROM orders WHERE buyer_id=? ORDER BY created_at DESC LIMIT 5',[req.user.id]);
    res.json({success:true,stats:{totalOrders,totalSpent,pendingOrders,wishlistCount},recentOrders});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
module.exports=router;