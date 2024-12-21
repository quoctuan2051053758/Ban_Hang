
module.exports.index =async (req,res)=>{
    res.render('client/pages/blog/about.pug',{
        pageTitle:"Về chúng tôi",
    });
    
}