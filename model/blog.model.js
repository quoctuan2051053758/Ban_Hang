const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")
mongoose.plugin(slug)

const blogSchema=new mongoose.Schema(
    { 
        title:String,
        content: {
            type: String,
            required: true,
        },
        thumbnail: String,
        status:{
            type:String,
            enum: ['active', 'inactive'],
            default: 'inactive',
        },
        updatedBy:[
            {
                account_id:String,
                updatedAt:Date
            }
        ],
        author:String,
        slug: {
            type:String,
            slug:"title",
            unique:true
        },
        createdBy: {
            account_id: { type: String, required: true }, 
            createdAt: { type: Date, default: Date.now }
        }
    },{
        timestamps:true
    }
);

const Blog = mongoose.model('Blog',blogSchema,"blogs")
module.exports = Blog;