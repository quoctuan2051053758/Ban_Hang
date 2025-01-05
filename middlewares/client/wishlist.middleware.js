// middleware/wishlistChecker.js
const Wishlist = require("../../model/wishlish.model");

module.exports.checkWishlist = async (req, res, next) => {
    if(res.locals.user){
        const userId = res.locals.user._id; 
        const wishlist = await Wishlist.findOne({ user_id: userId });
        const productIdsInWishlist = wishlist ? wishlist.product_id.map(item => item.productId) : [];
    
        res.locals.productIdsInWishlist = productIdsInWishlist;
    }else{
        res.locals.productIdsInWishlist = []
    }
    next(); 
};