const Cart = require("../../model/cart.model");
const User = require("../../model/user.model");

module.exports.cartId = async (req, res, next) => {
    try {
        const expireCookie = 360 * 24 * 60 * 60 * 1000; // Thời gian hết hạn cookie

        // Kiểm tra xem có cookie tokenUser không
        if (req.cookies.tokenUser) {
            const user = await User.findOne({
                tokenUser: req.cookies.tokenUser
            });

            // Nếu tìm thấy người dùng, lấy cart tương ứng
            if (user) {
                const cart = await Cart.findOne({ user_id: user.id });

                // Nếu tìm thấy cart, lưu cartId vào cookie và tính tổng số lượng
                if (cart) {
                    res.cookie("cartId", cart.id, {
                        expires: new Date(Date.now() + expireCookie)
                    });
                    cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
                    res.locals.miniCart = cart;
                }
            }
        } else {
            // Nếu không có tokenUser, kiểm tra cartId
            if (!req.cookies.cartId) {
                const cart = new Cart();
                await cart.save();
                res.cookie("cartId", cart.id, {
                    expires: new Date(Date.now() + expireCookie)
                });
            } else {
                const cart = await Cart.findOne({
                    _id: req.cookies.cartId
                });

                // Tính tổng số lượng nếu tìm thấy cart
                if (cart) {
                    cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
                    res.locals.miniCart = cart;
                }
            }
        }
        next();
    } catch (error) {
        // Nếu có lỗi, tạo cart mới và lưu vào cookie
        const cart = new Cart();
        await cart.save();
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expireCookie)
        });
    }
};