const mongoose = require("mongoose")

const wishlistSchema=new mongoose.Schema(
    { 
        user_id:{
            type:String,
            default:""
        },
        product_id:[
            {
                productId:String
            }
        ]
    },{
        timestamps:true
    }
);

const Wishlist = mongoose.model('Wishlist',wishlistSchema,"wishlists")
module.exports = Wishlist;