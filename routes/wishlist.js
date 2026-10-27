const express=require('express'),router=express.Router(),db=require('../db'),{verifyToken}=require('../middleware/auth');
router.get('/',verifyToken,async(req,res)=>{
  try{
    const[items]=await db.query('SELECT w.*,p.name,p.price_per_unit,p.image_url,p.is_available,u.full_name AS farmer_name,c.name AS category_name FROM wishlist w JOIN products p ON w.product_id=p.id JOIN users u ON p.farmer_id=u.id JOIN categories c ON p.category_id=c.id WHERE w.user_id=? ORDER BY w.created_at DESC',[req.user.id]);
    res.json({success:true,count:items.length,items});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.post('/toggle/:product_id',verifyToken,async(req,res)=>{
  try{
    const[ex]=await db.query('SELECT id FROM wishlist WHERE user_id=? AND product_id=?',[req.user.id,req.params.product_id]);
    if(ex.length){await db.query('DELETE FROM wishlist WHERE user_id=? AND product_id=?',[req.user.id,req.params.product_id]);return res.json({success:true,message:'Removed.',wishlisted:false});}
    await db.query('INSERT INTO wishlist (user_id,product_id) VALUES (?,?)',[req.user.id,req.params.product_id]);
    res.json({success:true,message:'Added!',wishlisted:true});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
module.exports=router;