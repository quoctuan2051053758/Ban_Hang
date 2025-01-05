const Cart = require("../../model/cart.model");
const User = require("../../model/user.model");

module.exports.cartId = async (req, res, next) => {
    try {
        const expireCookie = 360 * 24 * 60 * 60 * 1000;

        if (req.cookies.tokenUser) {
            const user = await User.findOne({
                tokenUser: req.cookies.tokenUser
            });
            if (user) {
                const cart = await Cart.findOne({ user_id: user.id });

                if (cart) {
                    res.cookie("cartId", cart.id, {
                        expires: new Date(Date.now() + expireCookie)
                    });
                    cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
                    res.locals.miniCart = cart;
                    
                }
            }
        } else {
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
                if (cart) {
                    cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
                    res.locals.miniCart = cart;
                    
                }
                
            }
        }
        
        next();
    } catch (error) {
        const expireCookie = 360 * 24 * 60 * 60 * 1000;
        const cart = new Cart();
        await cart.save();
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expireCookie)
        });
        next()
    }
};