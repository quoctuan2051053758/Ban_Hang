const Product= require("../../model/product.model")
const productsHelper= require("../../helpers/products")
// GET
module.exports.index = async(req,res)=>{
    // lấy danh sách nổi bật
    const productsFeatured = await Product.find({
        featured:"1",
        deleted:false,
        status:"active"
    }).limit(6)
    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)

    // lấy ra danh sách sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted:false,
        status:"active"
    }).sort({position:"desc"}).limit(4)

    const newproductsNew = productsHelper.priceNewProducts(productsNew)
    
    res.render('client/pages/home/index',{
        pageTitle:"Trang chủ",
        productsFeatured:newProductsFeatured,
        productsNew:newproductsNew
    });
}