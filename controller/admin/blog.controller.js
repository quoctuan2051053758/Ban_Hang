const Blog = require("../../model/blog.model")
const systemConfig= require("../../config/system")


//[GET] admin/index
module.exports.index = async (req,res)=>{
    const blogs=await Blog.find()
    res.render('admin/pages/blog/index',{
        pageTitle:"Trang bài viết",
        blogs:blogs
    });
}

//[GET] admin/blog/create
module.exports.create = async (req,res)=>{
    
    res.render('admin/pages/blog/create',{
        pageTitle:"Thêm bài viết",
    });
}
module.exports.createPost = async (req,res)=>{
    const { title, content, thumbnail,status,author } = req.body;
    req.body.createdBy={
        account_id : res.locals.user.id
    }
    const newBlog = new Blog({
        title,
        content,
        thumbnail,
        author,
        status,
        createdBy:  req.body.createdBy
    });
    console.log(req.body)
    await newBlog.save();
    req.flash("success","Thêm bài viết thành công")
    res.redirect(`${systemConfig.prefixAdmin}/blogs`)
}


//[GET] admin/blog/edit
module.exports.edit = async (req,res)=>{
    const id = req.params.id
    const blog= await Blog.findOne({
        _id:id
    })
    res.render('admin/pages/blog/edit',{
        pageTitle:"Chỉnh sửa bài viêt",
        blog:blog
    });
}

//[Patch] admin/blog/edit/:id
module.exports.editPatch = async (req,res)=>{
    const id = req.params.id
    // const { title, content, thumbnail,status, } = req.body;
    const updatedBy={
        account_id : res.locals.user.id,
        updatedAt:new Date()
    }
    await Blog.updateOne({_id:id},{
        ...req.body,
        $push: {updatedBy:updatedBy}
    })
    console.log(req.body)
    // await newBlog.save();
    req.flash("success","Cập nhật bài viết thành công")
    res.redirect(`${systemConfig.prefixAdmin}/blogs`)
}