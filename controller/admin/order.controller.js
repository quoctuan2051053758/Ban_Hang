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
                product.priceNewFormatted = product.priceNew.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                product.totalPriceFormatted = product.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            
            }
            order.totalPrice = order.products.reduce((sum,item)=>sum+item.totalPrice,0)
            order.totalPriceFormatted = order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        }   
    }
    
    res.render('admin/pages/order/index',{
        pageTitle:"Đặt hàng",
        orders:orders,
        pagination:objectPagination
    });
}

module.exports.detail = async (req,res)=>{
    let find = {
        _id:req.params.id
    };
    const order = await Order.findOne(find)
    for(const product of order.products){
        const productInfo = await Product.findOne({
            _id:product.product_id
        }).select("title thumbnail price discountPercentage")
        product.productInfo=productInfo
    }
    
    res.render('admin/pages/order/detail',{
        pageTitle:"Chi tiết đơn hàng",
        order:order
    });
}