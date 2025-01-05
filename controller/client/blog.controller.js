const Blog = require("../../model/blog.model")



module.exports.index =async (req,res)=>{
    try {
        const blogPosts = await Blog.find();
        const blogPostsNews = await Blog.find()
        .sort({ createdAt: -1 }) 
        .limit(2);
        res.render('client/pages/blog/index.pug',{
            pageTitle:"Trang tin tức",
            blogPosts:blogPosts,
            blogPostsNews:blogPostsNews
        });
    } catch (error) {
        console.error('Lỗi khi tải bài tin tức:', error);
        res.redirct("back")
    }
    
}
module.exports.detail =async (req,res)=>{

    try {
        const slug = req.params.slug
        const blog = await Blog.findOne({
            slug:slug
        }); 

        res.render('client/pages/blog/detail.pug',{
            pageTitle:blog.title,
            blog:blog
        });
    } catch (error) {
        console.error('Lỗi khi tải bài tin tức', error);
        res.redirct("back")
    }
    
}

