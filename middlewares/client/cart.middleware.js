const Cart = require("../../model/cart.model")
module.exports.cartId =async (req,res,next)=>{
    try{
        if(!req.cookies.cartId) {
            const cart = new Cart()
            await cart.save()
            const expireCookie = 360*24*60*60*1000
            res.cookie("cartId",cart.id,{
                expires:new Date(Date.now()+expireCookie)
            })
        }else{
            const cart = await Cart.findOne({
                _id:req.cookies.cartId
            })
            cart.totalQuantity = cart.products.reduce((sum,item)=>sum+item.quantity,0)
            res.locals.miniCart=cart
        }
        next()
    }catch{
        const cart = new Cart()
            await cart.save()
            const expireCookie = 360*24*60*60*1000
            res.cookie("cartId",cart.id,{
                expires:new Date(Date.now()+expireCookie)
            })
    }
}