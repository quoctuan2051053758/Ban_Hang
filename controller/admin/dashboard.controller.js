const Product = require("../../model/product.model")
const Order = require("../../model/order.model")
const productsHelper= require("../../helpers/products");
const User = require("../../model/user.model");
module.exports.dashboard = async(req,res)=>{ 
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const countDocuments = await Order.countDocuments();
        const countUser = await User.countDocuments();
        
        const orders = await Order.find({
            deleted:false,
            createdAt:{
                $gte: startOfDay, // Lớn hơn hoặc bằng 00:00:00 hôm nay
                $lt: endOfDay // Nhỏ hơn 00:00:00 ngày mai
            }
        })
        let total = 0
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
        total = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const formattedTotal = total.toLocaleString('vi-VN')
        
        //Lấy doanh thu cho tuần này
        
        const sevenDaysAgo = new Date(today); // Bắt đầu từ ngày hôm nay
        sevenDaysAgo.setDate(today.getDate() - 7); // Lùi lại 7 ngày


        
        let weeklyRevenue = Array(7).fill(0);
        try {
            const results = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: sevenDaysAgo,
                            $lt:  new Date(today.getTime() + 24 * 60 * 60 * 1000),
                        },
                        deleted: false // Không lấy đơn hàng đã bị xóa
                    }
                },
                {
                    $unwind: "$products" // Tách từng sản phẩm trong đơn hàng
                },
                {
                    $group: {
                        _id: {
                            $dayOfWeek: "$createdAt" // Nhóm theo thứ trong tuần (1-7, Chủ nhật đến thứ bảy)
                        },
                        totalRevenue: {
                            $sum: {
                                $multiply: ["$products.price", "$products.quantity"] // Tính doanh thu cho mỗi sản phẩm
                            }
                        }
                    }
                },
                {
                    $sort:{_id:1}
                }
            ]);
    
            results.forEach(result => {
                const dateIndex = (result._id + 5) % 7; // Tính chỉ số ngày trong mảng (0-6)
                weeklyRevenue[dateIndex] += result.totalRevenue; // Cộng doanh thu vào ngày tương ứng
            });
        } catch (error) {
            console.error('Có lỗi xảy ra khi tính toán doanh thu:', error);
            return 0;
        }
        const formattedWeeklyRevenue = weeklyRevenue.map(revenue => revenue.toLocaleString('vi-VN'));
        
        res.render('admin/pages/dashboard/index', {
            pageTitle: "Tổng quan",
            // order:order,
            total:formattedTotal,
            countDocuments:countDocuments,
            countUser:countUser,
            dailyRevenueData: weeklyRevenue
        });
    


    
};
