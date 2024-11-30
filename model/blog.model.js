const mongoose = require("mongoose")

const blogSchema=new mongoose.Schema(
    { 
        user_id:String,
        title:String,
        description:String,
        products:[
            {
                product_id:String,
                quantity:Number,
                size:String,
                color:String
            }
        ]
    },{
        timestamps:true
    }
);

const Blog = mongoose.model('Blog',blogSchema,"blogs")
module.exports = Blog;