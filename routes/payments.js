const express=require('express'),router=express.Router(),db=require('../db'),{verifyToken}=require('../middleware/auth');
router.post('/simulate',verifyToken,async(req,res)=>{
  try{
    const{order_id,payment_method,amount}=req.body;
    const txn='TXN'+Date.now()+Math.floor(Math.random()*9999);
    const ok=Math.random()>0.05;
    const status=ok?'success':'failed';
    const[r]=await db.query('INSERT INTO payments (order_id,buyer_id,amount,payment_method,transaction_id,status,payment_date) VALUES (?,?,?,?,?,?,NOW())',[order_id,req.user.id,amount,payment_method,txn,status]);
    if(ok){
      await db.query('UPDATE orders SET payment_status="paid",status="confirmed" WHERE id=?',[order_id]);
      await db.query('INSERT INTO notifications (user_id,title,message,type) VALUES (?,?,?,?)',[req.user.id,'Payment Successful ✅',`Rs.${amount} paid. Txn: ${txn}`,'payment']);
    }
    res.json({success:ok,message:ok?'Payment successful!':'Payment failed.',transaction_id:txn,status,payment_id:r.insertId});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.get('/my-payments',verifyToken,async(req,res)=>{
  try{
    const[payments]=await db.query('SELECT p.*,o.delivery_address FROM payments p JOIN orders o ON p.order_id=o.id WHERE p.buyer_id=? ORDER BY p.created_at DESC',[req.user.id]);
    res.json({success:true,payments});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
module.exports=router;