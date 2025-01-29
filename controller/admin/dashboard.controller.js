const Product = require("../../model/product.model");
const Order = require("../../model/order.model");
const productsHelper = require("../../helpers/products");
const User = require("../../model/user.model");

module.exports.dashboard = async (req, res) => { 
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const countDocuments = await Order.countDocuments();
    const countUser = await User.countDocuments();
    
    const orders = await Order.find({
        deleted: false,
        createdAt: {
            $gte: startOfDay,
            $lt: endOfDay 
        }
    });
    let total = 0;
    let productSales = {}; 

    for (const order of orders) {
        for (const product of order.products) {
            const productInfo = await Product.findOne({
                _id: product.product_id
            }).select("title thumbnail price discountPercentage");
            
            product.productInfo = productInfo;
            product.priceNew = productsHelper.priceNewProduct(product);
            product.totalPrice = product.priceNew * product.quantity;

            const key = `${product.product_id}-${product.size}-${product.color}`; 

            if (!productSales[key]) {
                productSales[key] = {
                    product_id: product.product_id,
                    title: productInfo.title, // Lưu tên sản phẩm
                    size: product.size,
                    color: product.color,
                    quantity: 0
                };
            }
            productSales[key].quantity += product.quantity; // Cộng số lượng
        }

        order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
    }
    const bestSellingProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity) 
        .slice(0, 3); 

    total = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const formattedTotal = total.toLocaleString('vi-VN');

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // Lùi lại 7 ngày
    const todayIndex = new Date().getDay()
    let weeklyRevenue = Array(7).fill(0);
    try {
        const results = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: sevenDaysAgo,
                        $lt: endOfDay,
                    },
                    deleted: false 
                }
            },
            {
                $unwind: "$products" 
            },
            {
                $group: {
                    _id: {
                        $dayOfWeek: "$createdAt" 
                    },
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                { 
                                    $subtract: [
                                        "$products.price", 
                                        { 
                                            $multiply: [
                                                "$products.price", 
                                                { $divide: ["$products.discountPercentage", 100] }
                                            ] 
                                        }
                                    ] 
                                },
                                "$products.quantity"
                            ]
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        results.forEach(result => {
            const dateIndex = (result._id + 5) % 7; 
            const adjustedIndex = (dateIndex + 7 - new Date().getDay()) % 7; 
            weeklyRevenue[adjustedIndex] += result.totalRevenue; 
        });
    } catch (error) {
        console.error('Có lỗi xảy ra khi tính toán doanh thu:', error);
        return 0;
    }

    const formattedWeeklyRevenue = weeklyRevenue.map(revenue => revenue.toLocaleString('vi-VN'));

    const countProducts = await Product.countDocuments({
        deleted:false
    })
    res.render('admin/pages/dashboard/index', {
        pageTitle: "Tổng quan",
        total: formattedTotal,
        countDocuments: countDocuments,
        countUser: countUser,
        dailyRevenueData: formattedWeeklyRevenue,
        weeklyRevenue:weeklyRevenue,
        bestSellingProducts ,
        countProducts
    });
};