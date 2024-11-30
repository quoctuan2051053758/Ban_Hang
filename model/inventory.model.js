const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")
mongoose.plugin(slug)

const inventorySchema=new mongoose.Schema(
    {   
        title: {
            type: String,
            required: true
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Liên kết với bảng sản phẩm
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true // Giá khi nhập hoặc xuất
        },
        transactionType: {
            type: String,
            enum: ['import', 'export'], // Chỉ cho phép hai loại giao dịch
            required: true
        },
        slug: {
            type:String,
            slug:"title",
            unique:true
        },
        createdBy:{
            account_id:String,
            createdAt:{
                type:Date,
                default:Date.now
            }
        },
        deleted: {
            type: Boolean,
            default:false,
        },
        deletedBy:{
            account_id:String,
            deletedAt:Date
        },
        updatedBy:[
            {
                account_id:String,
                updatedAt:Date
            }
        ],
    },{
        timestamps:true
    }
);

const Inventory = mongoose.model('Inventory',inventorySchema,"inventorys")
module.exports = Inventory;