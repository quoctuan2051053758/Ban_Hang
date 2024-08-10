const productRoute=require("./pruduct.route")
const homeRoute=require("./home.route")

module.exports = (app)=>{
    app.use("/",homeRoute)
    app.use("/products",productRoute)
}