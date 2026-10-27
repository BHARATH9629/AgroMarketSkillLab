const express=require('express'),router=express.Router(),db=require('../db'),{verifyToken,authorizeRoles}=require('../middleware/auth');
router.get('/',async(req,res)=>{
  try{
    const{city,state,farming_type,page=1,limit=12}=req.query;const offset=(page-1)*limit;
    let q="SELECT u.id,u.full_name,u.city,u.state,u.profile_image,fp.farm_name,fp.farming_type,fp.rating,fp.total_sales,COUNT(p.id) AS product_count FROM users u JOIN farmer_profiles fp ON fp.user_id=u.id LEFT JOIN products p ON p.farmer_id=u.id AND p.is_available=TRUE WHERE u.role='farmer' AND u.is_active=TRUE";
    const params=[];
    if(city){q+=' AND u.city=?';params.push(city);}
    if(state){q+=' AND u.state=?';params.push(state);}
    if(farming_type){q+=' AND fp.farming_type=?';params.push(farming_type);}
    q+=' GROUP BY u.id,u.full_name,u.city,u.state,u.profile_image,fp.farm_name,fp.farming_type,fp.rating,fp.total_sales ORDER BY fp.rating DESC LIMIT ? OFFSET ?';params.push(parseInt(limit),parseInt(offset));
    const[farmers]=await db.query(q,params);
    res.json({success:true,count:farmers.length,farmers});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.get('/:id',async(req,res)=>{
  try{
    const[farmers]=await db.query('SELECT u.id,u.full_name,u.city,u.state,u.address,u.profile_image,u.created_at,fp.* FROM users u JOIN farmer_profiles fp ON fp.user_id=u.id WHERE u.id=? AND u.role="farmer"',[req.params.id]);
    if(!farmers.length)return res.status(404).json({success:false,message:'Farmer not found.'});
    const[products]=await db.query('SELECT p.*,c.name AS category_name FROM products p JOIN categories c ON p.category_id=c.id WHERE p.farmer_id=? AND p.is_available=TRUE',[req.params.id]);
    const[reviews]=await db.query('SELECT r.*,u.full_name AS reviewer_name FROM reviews r JOIN users u ON r.reviewer_id=u.id WHERE r.farmer_id=? ORDER BY r.created_at DESC LIMIT 5',[req.params.id]);
    res.json({success:true,farmer:farmers[0],products,reviews});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
module.exports=router;