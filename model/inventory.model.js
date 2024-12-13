const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {   
        code: { type: String, required: true },
        expectedDate: { type: Date, required: true },
        status: { type: String },
        items: [{
            variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantityAvailable: { type: Number, required: true },
            quantityReceived: { type: Number, required: true },
            importPrice: { type: Number, required: true }
        }],
        createdBy: {
            account_id: { type: String, required: true }, 
            createdAt: { type: Date, default: Date.now }
        }
    },
    {
        timestamps: true  
    }
);

const Inventory = mongoose.model('Inventory', inventorySchema, "inventorys");
module.exports = Inventory;