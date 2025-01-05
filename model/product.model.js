const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")
mongoose.plugin(slug)

const variantSchema = new mongoose.Schema({
    color: { type: String, required: true },
    price: { type: Number, required: true },
    stock:{ type: Number, required: true },
    size:{type:String, required: true}
});

const productSchema=new mongoose.Schema(
    { 
        title: String,
        product_category_id:{
            type:String,
            default:""
        },
        description: String,
        discountPercentage: Number,
        variants:[variantSchema],
        thumbnail: {
            type: [String], 
            default: []
        },
        status: String,
        featured: { type: String, enum: ['1', '0'], default: '0' },
        position: Number,
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

const Product = mongoose.model('Product',productSchema,"products")
module.exports = Product;