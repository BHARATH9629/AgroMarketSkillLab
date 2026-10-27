const express=require('express'),router=express.Router(),db=require('../db'),{verifyToken,authorizeRoles}=require('../middleware/auth');
router.post('/validate',verifyToken,async(req,res)=>{
  try{
    const{code,order_amount}=req.body;
    const[coupons]=await db.query("SELECT * FROM coupons WHERE code=? AND is_active=TRUE AND (expires_at IS NULL OR expires_at>NOW()) AND used_count<usage_limit",[code]);
    if(!coupons.length)return res.status(404).json({success:false,message:'Invalid or expired coupon.'});
    const c=coupons[0];
    if(order_amount<c.min_order_amount)return res.status(400).json({success:false,message:`Min order Rs.${c.min_order_amount} required.`});
    let discount=c.discount_type==='percentage'?Math.min((order_amount*c.discount_value)/100,c.max_discount||Infinity):c.discount_value;
    res.json({success:true,message:`Coupon applied! Save Rs.${discount.toFixed(2)}`,discount:discount.toFixed(2),final_amount:(order_amount-discount).toFixed(2)});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.get('/',verifyToken,authorizeRoles('admin'),async(req,res)=>{
  try{const[coupons]=await db.query('SELECT * FROM coupons ORDER BY created_at DESC');res.json({success:true,coupons});}
  catch(err){res.status(500).json({success:false,message:err.message});}
});
module.exports=router;