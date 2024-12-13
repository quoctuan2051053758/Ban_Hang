const Product = require("../../model/product.model")
const Wishlist = require("../../model/wishlish.model")
module.exports.model =async (req,res,next)=>{
    const productModel = [];
    
    const products = await Product.find()
    for(const product of products){
        const variants = product.variants.map(variant => ({
            size:variant.size,
            color:variant.color,
            price: variant.price,
            stock:variant.stock,
            discountPrice: variant.price - (variant.price * (product.discountPercentage / 100))
        }));
        const sizesByColor = product.variants.reduce((acc, variant) => {
            if (!acc[variant.color]) {
                acc[variant.color] = []; // Khởi tạo mảng cho màu sắc nếu chưa có
            }
            acc[variant.color].push({
                size: variant.size,
                price: variant.price,
                stock: variant.stock,
                discountPrice: (variant.price - (variant.price * (product.discountPercentage / 100))).toFixed(0)
            });
            return acc;
        }, {});
        
        const uniqueColors = Object.keys(sizesByColor);
        
        
        const productDetail = {
            ...product.toObject(), // 
            variants,              
            sizesByColor,         
            uniqueColors,                  
        };
        productModel.push(productDetail);
    }
    res.locals.productModel =productModel
    next()
}
