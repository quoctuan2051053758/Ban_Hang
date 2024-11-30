const Product = require("../../model/product.model")
const Order = require("../../model/order.model")
const productsHelper= require("../../helpers/products");

module.exports.dashboard = async(req,res)=>{ 
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const orders = await Order.find({
            deleted:false,
            createdAt:{
                $gte: startOfDay, // Lớn hơn hoặc bằng 00:00:00 hôm nay
                $lt: endOfDay // Nhỏ hơn 00:00:00 ngày mai
            }
        })
        for (const order of orders){
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
        const total = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const formattedTotal = total.toLocaleString('vi-VN')

        res.render('admin/pages/dashboard/index', {
            pageTitle: "Dashboard",
            // order:order,
            total:formattedTotal
            
        });
    // const statistic={
    //     categoryProduct:{
    //         total:0,
    //         active:0,
    //         inactive:0
    //     },
    //     product:{
    //         total:0,
    //         active:0,
    //         inactive:0
    //     },
    //     account:{
    //         total:0,
    //         active:0,
    //         inactive:0
    //     },
    //     user:{
    //         total:0,
    //         active:0,
    //         inactive:0
    //     }
    // }
    // statistic.categoryProduct.total= await ProductCategory.countDocuments({
    //     deleted:false,
    // })
    // statistic.categoryProduct.active= await ProductCategory.countDocuments({
    //     deleted:false,
    //     status:"active"
    // })
    // statistic.categoryProduct.inactive= await ProductCategory.countDocuments({
    //     deleted:false,
    //     status:"inactive"
    // })
    // res.render('admin/pages/dashboard/index',{
    //     pageTitle:"Trang tổng quan",
    //     statistic:statistic
    // });


    
};
