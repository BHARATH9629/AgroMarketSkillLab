const express=require('express'),router=express.Router(),db=require('../db'),{verifyToken}=require('../middleware/auth');
router.post('/send',verifyToken,async(req,res)=>{
  try{
    const{receiver_id,message,product_id}=req.body;
    if(!receiver_id||!message)return res.status(400).json({success:false,message:'Receiver and message required.'});
    const[r]=await db.query('INSERT INTO messages (sender_id,receiver_id,message,product_id) VALUES (?,?,?,?)',[req.user.id,receiver_id,message,product_id||null]);
    await db.query('INSERT INTO notifications (user_id,title,message,type) VALUES (?,?,?,?)',[receiver_id,'New Message 💬','You have a new message!','message']);
    res.status(201).json({success:true,message:'Sent!',id:r.insertId});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.get('/inbox',verifyToken,async(req,res)=>{
  try{
    const[messages]=await db.query('SELECT m.*,u.full_name AS sender_name,u.role AS sender_role FROM messages m JOIN users u ON m.sender_id=u.id WHERE m.receiver_id=? ORDER BY m.created_at DESC',[req.user.id]);
    res.json({success:true,count:messages.length,messages});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.get('/conversation/:user_id',verifyToken,async(req,res)=>{
  try{
    const[messages]=await db.query('SELECT m.*,u.full_name AS sender_name FROM messages m JOIN users u ON m.sender_id=u.id WHERE (m.sender_id=? AND m.receiver_id=?) OR (m.sender_id=? AND m.receiver_id=?) ORDER BY m.created_at ASC',[req.user.id,req.params.user_id,req.params.user_id,req.user.id]);
    await db.query('UPDATE messages SET is_read=TRUE WHERE receiver_id=? AND sender_id=?',[req.user.id,req.params.user_id]);
    res.json({success:true,messages});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.get('/unread-count',verifyToken,async(req,res)=>{
  try{
    const[[r]]=await db.query('SELECT COUNT(*) AS count FROM messages WHERE receiver_id=? AND is_read=FALSE',[req.user.id]);
    res.json({success:true,count:r.count});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
module.exports=router;