const Order = require("../../model/order.model")
const systemConfig= require("../../config/system")
const paginationHelper = require("../../helpers/pagination")
const searchHelper = require("../../helpers/search")
const Product = require("../../model/product.model")
const productsHelper= require("../../helpers/products");
//[GET] admin/order
module.exports.index = async (req,res)=>{
    let find = {
        deleted:false
    };
    const countOrders = await Order.countDocuments(find)
    let objectPagination=paginationHelper(
        {
            currentPage:1,
            limitItems:4
        },
        req.query,
        countOrders
    )

    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex
    }

    // if(req.query.sortKey && req.query.sortValue){
    //     sort[req.query.sortKey] =req.query.sortValue
        
    // }else{
    //     sort.position = "desc"
    //     }
    const orders = await Order.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
    for(const order of orders){ 
        if(Array.isArray(order.products)){
            for(const product of order.products){
                const productInfo = await Product.findOne({
                    _id:product.product_id
                }).select("title thumbnail price discountPercentage")
                product.productInfo=productInfo
                product.priceNew=productsHelper.priceNewProduct(product)
                product.totalPrice =product.priceNew * product.quantity
            }
            order.totalPrice = order.products.reduce((sum,item)=>sum+item.totalPrice,0)

        }
    }
    
    res.render('admin/pages/order/index',{
        pageTitle:"Đặt hàng",
        orders:orders,
        pagination:objectPagination
    });
}