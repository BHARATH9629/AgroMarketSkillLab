const express=require('express'),router=express.Router(),db=require('../db'),{verifyToken}=require('../middleware/auth');
router.get('/',verifyToken,async(req,res)=>{
  try{
    const[notifs]=await db.query('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 20',[req.user.id]);
    const[[{count}]]=await db.query('SELECT COUNT(*) AS count FROM notifications WHERE user_id=? AND is_read=FALSE',[req.user.id]);
    res.json({success:true,unread:count,unreadCount:count,notifications:notifs});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.patch('/mark-all-read',verifyToken,async(req,res)=>{
  try{await db.query('UPDATE notifications SET is_read=TRUE WHERE user_id=?',[req.user.id]);res.json({success:true,message:'All read.'});}
  catch(err){res.status(500).json({success:false,message:err.message});}
});
router.delete('/:id',verifyToken,async(req,res)=>{
  try{await db.query('DELETE FROM notifications WHERE id=? AND user_id=?',[req.params.id,req.user.id]);res.json({success:true,message:'Deleted.'});}
  catch(err){res.status(500).json({success:false,message:err.message});}
});
module.exports=router;