
const Cart = require("../../model/cart.model")
const Product = require("../../model/product.model")
const Wishlist = require('../../model/wishlish.model');

module.exports.cartsub=async(req,res,next) => {
    const cartId=req.cookies.cartId
    const cart = await Cart.findOne({
        _id:cartId
    })
    if(cart.products.length > 0){
        for (const item of cart.products){
            const productId = item.product_id
            const productInfo = await Product.findOne({
                _id:productId,
            }).select("title thumbnail slug price discountPercentage variants")
            item.productInfo=productInfo
            const selectedVariant = productInfo.variants.find(variant => 
                variant.color === item.color && variant.size === item.size
            )
            if (selectedVariant) {
                const discountPrice = selectedVariant.price - (selectedVariant.price * (productInfo.discountPercentage / 100));
                item.price = selectedVariant.price; 
                item.discountPrice = discountPrice; 
            }else {
                item.price = 0; 
                item.discountPrice = 0;
            }
            item.totalPrice = item.discountPrice * item.quantity   
        }
    }
    cart.totalPrice = cart.products.reduce((sum,item)=>sum+item.totalPrice,0)
    cart.totalPrice = cart.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    cart.products.forEach(item => {
        item.priceFormatted = item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        item.discountPrice = item.discountPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        item.totalPrice = item.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    });
    res.locals.cartsub = cart
    next()
}