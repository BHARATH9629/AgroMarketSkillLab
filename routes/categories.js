const express=require('express'),router=express.Router(),db=require('../db'),{verifyToken,authorizeRoles}=require('../middleware/auth');
router.get('/',async(req,res)=>{
  try{
    const[cats]=await db.query('SELECT c.*,COUNT(p.id) AS product_count FROM categories c LEFT JOIN products p ON c.id=p.category_id AND p.is_available=TRUE WHERE c.is_active=TRUE GROUP BY c.id ORDER BY product_count DESC');
    res.json({success:true,categories:cats});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.post('/',verifyToken,authorizeRoles('admin'),async(req,res)=>{
  try{
    const{name,description,image_url}=req.body;
    const[r]=await db.query('INSERT INTO categories (name,description,image_url) VALUES (?,?,?)',[name,description,image_url]);
    res.status(201).json({success:true,message:'Category created!',id:r.insertId});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
module.exports=router;