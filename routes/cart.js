const express=require('express'),router=express.Router(),db=require('../db'),{verifyToken}=require('../middleware/auth');
router.get('/',verifyToken,async(req,res)=>{
  try{
    const[items]=await db.query('SELECT c.*,p.name,p.price_per_unit,p.image_url,p.quantity_available,p.unit,u.full_name AS farmer_name,(c.quantity*p.price_per_unit) AS item_total FROM cart c JOIN products p ON c.product_id=p.id JOIN users u ON p.farmer_id=u.id WHERE c.user_id=?',[req.user.id]);
    const total=items.reduce((s,i)=>s+parseFloat(i.item_total),0);
    res.json({success:true,items,total:total.toFixed(2),count:items.length});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.post('/add',verifyToken,async(req,res)=>{
  try{
    const{product_id,quantity}=req.body;
    const[ps]=await db.query('SELECT * FROM products WHERE id=? AND is_available=TRUE',[product_id]);
    if(!ps.length)return res.status(404).json({success:false,message:'Product not available.'});
    if(quantity>ps[0].quantity_available)return res.status(400).json({success:false,message:'Not enough stock.'});
    await db.query('INSERT INTO cart (user_id,product_id,quantity) VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantity=?',[req.user.id,product_id,quantity,quantity]);
    res.json({success:true,message:'Added to cart!'});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.put('/update/:product_id',verifyToken,async(req,res)=>{
  try{
    const{quantity}=req.body;
    if(quantity<=0){await db.query('DELETE FROM cart WHERE user_id=? AND product_id=?',[req.user.id,req.params.product_id]);return res.json({success:true,message:'Removed.'});}
    await db.query('UPDATE cart SET quantity=? WHERE user_id=? AND product_id=?',[quantity,req.user.id,req.params.product_id]);
    res.json({success:true,message:'Updated.'});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.delete('/remove/:product_id',verifyToken,async(req,res)=>{
  try{await db.query('DELETE FROM cart WHERE user_id=? AND product_id=?',[req.user.id,req.params.product_id]);res.json({success:true,message:'Removed.'});}
  catch(err){res.status(500).json({success:false,message:err.message});}
});
router.delete('/clear',verifyToken,async(req,res)=>{
  try{await db.query('DELETE FROM cart WHERE user_id=?',[req.user.id]);res.json({success:true,message:'Cart cleared.'});}
  catch(err){res.status(500).json({success:false,message:err.message});}
});
module.exports=router;