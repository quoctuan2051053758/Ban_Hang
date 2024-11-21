const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const userMiddleware = require("../../middlewares/client/user.middleware")

const productRoute=require("./pruduct.route")
const homeRoute=require("./home.route")
const searchRoute=require("./search.route")
const cartRoute=require("./cart.route")
const checkoutRoute=require("./checkout.route")
const userRoute=require("./user.route")


module.exports = (app)=>{
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use(userMiddleware.infoUser)

    app.use("/",homeRoute)

    app.use("/products",productRoute)

    app.use("/search",searchRoute)

    app.use("/cart",cartRoute)

    app.use("/checkout",checkoutRoute)

    app.use("/user",userRoute)
}