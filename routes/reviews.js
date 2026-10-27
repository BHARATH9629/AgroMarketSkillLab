const express=require('express'),router=express.Router(),db=require('../db'),{verifyToken}=require('../middleware/auth');
router.post('/',verifyToken,async(req,res)=>{
  try{
    const{product_id,farmer_id,rating,title,comment}=req.body;
    if(!rating||rating<1||rating>5)return res.status(400).json({success:false,message:'Rating 1-5 required.'});
    let verified=false;
    if(product_id){const[o]=await db.query("SELECT oi.id FROM order_items oi JOIN orders o ON oi.order_id=o.id WHERE oi.product_id=? AND o.buyer_id=? AND o.status='delivered'",[product_id,req.user.id]);verified=o.length>0;}
    const[r]=await db.query('INSERT INTO reviews (reviewer_id,product_id,farmer_id,rating,title,comment,is_verified_purchase) VALUES (?,?,?,?,?,?,?)',[req.user.id,product_id||null,farmer_id||null,rating,title||'',comment||'',verified]);
    if(product_id)await db.query('UPDATE products SET rating=(SELECT AVG(rating) FROM reviews WHERE product_id=?),total_ratings=(SELECT COUNT(*) FROM reviews WHERE product_id=?) WHERE id=?',[product_id,product_id,product_id]);
    res.status(201).json({success:true,message:'Review submitted!',id:r.insertId});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.get('/product/:id',async(req,res)=>{
  try{
    const[reviews]=await db.query('SELECT r.*,u.full_name AS reviewer_name FROM reviews r JOIN users u ON r.reviewer_id=u.id WHERE r.product_id=? ORDER BY r.created_at DESC',[req.params.id]);
    const[[avg]]=await db.query('SELECT AVG(rating) AS avg_rating,COUNT(*) AS total FROM reviews WHERE product_id=?',[req.params.id]);
    res.json({success:true,avg_rating:avg.avg_rating,total:avg.total,reviews});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.delete('/:id',verifyToken,async(req,res)=>{
  try{
    await db.query('DELETE FROM reviews WHERE id=? AND reviewer_id=?',[req.params.id,req.user.id]);
    res.json({success:true,message:'Review deleted.'});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
module.exports=router;