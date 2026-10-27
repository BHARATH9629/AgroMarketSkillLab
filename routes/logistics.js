const express=require('express'),router=express.Router(),db=require('../db'),{verifyToken}=require('../middleware/auth');
router.post('/create',verifyToken,async(req,res)=>{
  try{
    const{order_id,distributor_id,pickup_address,delivery_address,weight_kg,vehicle_number,driver_name,driver_phone}=req.body;
    const tracking='AGR'+Date.now();
    const ed=new Date();ed.setDate(ed.getDate()+3);
    const[r]=await db.query('INSERT INTO shipments (order_id,distributor_id,tracking_number,pickup_address,delivery_address,weight_kg,vehicle_number,driver_name,driver_phone,estimated_delivery) VALUES (?,?,?,?,?,?,?,?,?,?)',[order_id,distributor_id||null,tracking,pickup_address,delivery_address,weight_kg,vehicle_number,driver_name,driver_phone,ed]);
    await db.query('UPDATE orders SET status="processing" WHERE id=?',[order_id]);
    res.status(201).json({success:true,message:'Shipment created!',tracking_number:tracking,shipmentId:r.insertId});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.get('/track/:tracking_number',async(req,res)=>{
  try{
    const[shipments]=await db.query('SELECT s.*,o.total_amount,o.status AS order_status FROM shipments s JOIN orders o ON s.order_id=o.id WHERE s.tracking_number=?',[req.params.tracking_number]);
    if(!shipments.length)return res.status(404).json({success:false,message:'Not found.'});
    res.json({success:true,shipment:shipments[0]});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
module.exports=router;