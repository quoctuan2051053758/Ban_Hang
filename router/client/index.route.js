const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const userMiddleware = require("../../middlewares/client/user.middleware")
const settingMiddleware = require("../../middlewares/client/setting.middleware")
const modelMiddleware = require("../../middlewares/client/model.middleware")
const cartsubMiddleware = require("../../middlewares/client/cartsub.middleware")
const wishlistMiddleware = require("../../middlewares/client/wishlist.middleware")
const authMiddleware = require("../../middlewares/client/auth.middleware")

const productRoute=require("./pruduct.route")
const homeRoute=require("./home.route")
const searchRoute=require("./search.route")
const cartRoute=require("./cart.route")
const checkoutRoute=require("./checkout.route")
const userRoute=require("./user.route")
const blogRoute=require("./blog.route")
const wishlistRoute=require("./wishlist.route")

module.exports = (app)=>{
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use(userMiddleware.infoUser)
    app.use(settingMiddleware.settingGeneral)
    app.use(modelMiddleware.model)
    app.use(cartsubMiddleware.cartsub)
    app.use(wishlistMiddleware.checkWishlist)
    app.use("/",homeRoute)

    app.use("/products",productRoute)

    app.use("/search",searchRoute)

    app.use("/cart",cartRoute)

    app.use("/checkout",checkoutRoute)

    app.use("/user",userRoute)

    app.use("/blogs",blogRoute)

    app.use("/wishlists",wishlistRoute,authMiddleware.requireAuth)
}