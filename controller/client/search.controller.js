const Product = require("../../model/product.model")
const productsHelper= require("../../helpers/products")
const paginationHelper = require("../../helpers/pagination")
// [GET] /search
module.exports.index =async (req,res)=>{
    const keyword=req.query.keyword
    const countProducts = await Product.countDocuments({
        title:new RegExp(keyword,"i"),
        deleted:false,
        status:"active"
    })
    let objectPagination=paginationHelper(
        {
            currentPage:1,
            limitItems:9
        },
        req.query,
        countProducts
    )
    let  newProducts=[]
    if(keyword){
        const regex= new RegExp(keyword,"i")
        const products=await Product.find({
            title:regex,
            deleted:false,
            status:"active"
        }).sort({position:"desc"})
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
        newProducts=products
    }
    res.render('client/pages/search/index',{
        pageTitle:"Kết quả tìm kiếmâ",
        keyword:keyword,
        products:newProducts,
        pagination:objectPagination
    });
}