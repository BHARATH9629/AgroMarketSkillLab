const express=require('express'),router=express.Router(),db=require('../db'),{verifyToken,authorizeRoles}=require('../middleware/auth');
router.post('/',verifyToken,authorizeRoles('buyer','admin'),async(req,res)=>{
  try{
    const{items,delivery_address,delivery_city,delivery_state,delivery_pincode,payment_method,notes}=req.body;
    if(!items||!items.length)return res.status(400).json({success:false,message:'No items in order.'});
    let total=0;const oi=[];
    for(const item of items){
      const[ps]=await db.query('SELECT * FROM products WHERE id=? AND is_available=TRUE',[item.product_id]);
      if(!ps.length)return res.status(404).json({success:false,message:`Product ${item.product_id} not found.`});
      const p=ps[0];
      if(item.quantity>p.quantity_available)return res.status(400).json({success:false,message:`Not enough stock for ${p.name}.`});
      const t=p.price_per_unit*item.quantity;total+=t;
      oi.push({product_id:p.id,product_name:p.name,unit:p.unit||'kg',farmer_id:p.farmer_id,quantity:item.quantity,price_per_unit:p.price_per_unit,total_price:t});
    }
    const ed=new Date();ed.setDate(ed.getDate()+5);
    const[r]=await db.query('INSERT INTO orders (buyer_id,total_amount,delivery_address,delivery_city,delivery_state,delivery_pincode,payment_method,notes,expected_delivery) VALUES (?,?,?,?,?,?,?,?,?)',
      [req.user.id,total,delivery_address,delivery_city||'',delivery_state||'',delivery_pincode||'',payment_method||'cod',notes||'',ed]);
    const oid=r.insertId;
    for(const item of oi){
      await db.query('INSERT INTO order_items (order_id,product_id,farmer_id,quantity,price_per_unit,total_price) VALUES (?,?,?,?,?,?)',[oid,item.product_id,item.farmer_id,item.quantity,item.price_per_unit,item.total_price]);
      await db.query('UPDATE products SET quantity_available=quantity_available-?,total_sold=total_sold+? WHERE id=?',[item.quantity,item.quantity,item.product_id]);
      
      // 🌾 Instant Notification for Farmer/Distributor Seller
      await db.query('INSERT INTO notifications (user_id,title,message,type) VALUES (?,?,?,?)',[
        item.farmer_id,
        `🌾 New Order Received! #ORD-${oid}`,
        `A customer purchased ${item.quantity} ${item.unit} of "${item.product_name}" (Earned: ₹${item.total_price}). Delivery destination: ${delivery_address}, ${delivery_city || ''}. Log in to view details and dispatch!`,
        'order'
      ]);
    }
    await db.query('INSERT INTO notifications (user_id,title,message,type) VALUES (?,?,?,?)',[req.user.id,'Order Placed! 🎉',`Order #ORD-${oid} placed. Total: Rs.${total}`,'order']);
    
    // Log Activity to MongoDB
    try {
      const { ActivityFeed } = require('../mongodb');
      await ActivityFeed.create({
        userId: req.user.id,
        userName: req.user.full_name || 'Buyer',
        action: 'order_placed',
        details: { orderId: oid, total, itemsCount: items.length, deliveryCity: delivery_city },
        ip: req.ip || ''
      });
    } catch(e) {}

    res.status(201).json({success:true,message:'Order placed!',orderId:oid,total_amount:total,expected_delivery:ed});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.get('/my-orders',verifyToken,async(req,res)=>{
  try{
    const[orders]=await db.query('SELECT o.*,COUNT(oi.id) AS item_count FROM orders o LEFT JOIN order_items oi ON o.id=oi.order_id WHERE o.buyer_id=? GROUP BY o.id ORDER BY o.created_at DESC',[req.user.id]);
    for(const ord of orders){
      const[items]=await db.query('SELECT oi.*,p.name AS product_name,p.image_url,p.unit,u.full_name AS farmer_name,u.phone AS farmer_phone FROM order_items oi JOIN products p ON oi.product_id=p.id JOIN users u ON oi.farmer_id=u.id WHERE oi.order_id=?',[ord.id]);
      ord.items=items;
    }
    res.json({success:true,orders});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.get('/:id',verifyToken,async(req,res)=>{
  try{
    const[orders]=await db.query('SELECT o.*,u.full_name AS buyer_name,u.email AS buyer_email FROM orders o JOIN users u ON o.buyer_id=u.id WHERE o.id=?',[req.params.id]);
    if(!orders.length)return res.status(404).json({success:false,message:'Not found.'});
    const[items]=await db.query('SELECT oi.*,p.name AS product_name,p.image_url,u.full_name AS farmer_name FROM order_items oi JOIN products p ON oi.product_id=p.id JOIN users u ON oi.farmer_id=u.id WHERE oi.order_id=?',[req.params.id]);
    res.json({success:true,order:orders[0],items});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.patch('/:id/cancel',verifyToken,async(req,res)=>{
  try{
    const{cancellation_reason}=req.body;
    const[orders]=await db.query('SELECT * FROM orders WHERE id=? AND buyer_id=?',[req.params.id,req.user.id]);
    if(!orders.length)return res.status(404).json({success:false,message:'Not found.'});
    if(['delivered','cancelled'].includes(orders[0].status))return res.status(400).json({success:false,message:'Cannot cancel.'});
    await db.query('UPDATE orders SET status="cancelled",cancellation_reason=? WHERE id=?',[cancellation_reason,req.params.id]);
    const[items]=await db.query('SELECT * FROM order_items WHERE order_id=?',[req.params.id]);
    for(const item of items)await db.query('UPDATE products SET quantity_available=quantity_available+? WHERE id=?',[item.quantity,item.product_id]);
    res.json({success:true,message:'Order cancelled.'});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
router.patch('/:id/status',verifyToken,async(req,res)=>{
  try{
    const{status}=req.body;
    await db.query('UPDATE orders SET status=? WHERE id=?',[status,req.params.id]);
    if(status==='delivered')await db.query('UPDATE orders SET actual_delivery=NOW() WHERE id=?',[req.params.id]);
    res.json({success:true,message:`Status updated to ${status}.`});
  }catch(err){res.status(500).json({success:false,message:err.message});}
});
module.exports=router;