
const express = require('express');
const router = express.Router();
const Order = require('../models/order.js');
//Add new order
router.post('/', async (req, res) => {

   
    const { allProduct, user, amount} = req.body;

    console.log(req.body)
  
    const newOrder = new Order({ allProduct:allProduct, user:user,amount:amount })
    try {
    await newOrder.save();
    res.status(201).json(newOrder );
    } catch (error) {
    res.status(409).json({ message: error.message });
    }
});

// afficher la liste des commandes.
router.get('/', async (req, res, )=> {
    try {
        let Orders = await Order.find({}, null, {sort: {'_id': -1}}).populate('allProduct.article').exec();
        
        if (Orders) {
        return res.json({ Orders });
        }
        } catch (err) {
        console.log(err);
        }
    })

// modifier état commande
router.put('/:id', async (req, res) => {  
     const newStatus = req.body.status;
    const orderId=req.params.id;
    if (!['Not processed', 'Processing', 'Shipped', 'Delivered'].includes(newStatus)) {
    res.status(403).json({ message: 'Invalid status value' }); return;
    }
    try { 
    const orderUpdated = await Order.findByIdAndUpdate(
    orderId,
    { status: newStatus },
    { new: true } // Return the updated document
    );
    if (!orderUpdated) {
    return res.status(404).json({ message: 'Order not found' });
    }
    const order = await Order.findById(orderId).populate("allProduct.article").exec();
              
    res.status(200).json(order);
   
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
    // Supprimer une commande
    router.delete('/:id', async (req, res)=> {
    const id = req.params.id;
    await Order.findByIdAndDelete(id);
    res.json({ message: "Order deleted successfully." });
    });
    
    module.exports = router;
