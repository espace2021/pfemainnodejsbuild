const mongoose = require("mongoose");
const Article = require("./article");

const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema(
    {
    
    allProduct: [
    {
        article:{type:mongoose.Schema.Types.ObjectId,ref:Article},
        
        quantity: Number, 
        price: {type: Number,default: 0 }
}, 
], 
    user: { type: String, required: true, }, 
    amount: { type: Number, required: true, }, 
    status: { type: String, default: "Not processed",
     enum: [ "Not processed", 
     "Processing",
    "Shipped", 
    "Delivered"
    ]
    , }, 


},
     { timestamps: true }
);

// Create a unique compound index on reference within allProduct

module.exports = mongoose.model("order", orderSchema);