const Product = require("../../model/product.model")
const productsHelper= require("../../helpers/products")
module.exports.index = async(req,res)=>{
    const products = await Product.find({
        status : "active",
        deleted:false
    }).sort({position:"desc"});

    const newProducts = productsHelper.priceNewProducts(products)

    // console.log(products)
    res.render('client/pages/products/index',{
        pageTitle:"Trang danh sách sản phẩm",
        products:newProducts
    });
}

//[GET] /products/:slug

module.exports.detail = async(req,res)=>{
    try{
        const find = {
            deleted:false,
            slug:req.params.slug,
            status:"active"
        }
        const product = await Product.findOne(find)
        res.render('client/pages/products/detail',{
            pageTitle:product.title,
            product:product
        });
    }catch(error){
        res.redirect("/products")
    }
}