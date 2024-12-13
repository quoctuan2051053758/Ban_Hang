// middleware/wishlistChecker.js
const Wishlist = require("../../model/wishlish.model");

module.exports.checkWishlist = async (req, res, next) => {
    const userId = res.locals.user.id; // Giả sử bạn đã xác thực người dùng
    const wishlist = await Wishlist.findOne({ user_id: userId });
    const productIdsInWishlist = wishlist ? wishlist.product_id.map(item => item.productId) : [];

    // Gán danh sách ID sản phẩm trong wishlist vào locals để có thể sử dụng trong các middleware khác
    res.locals.productIdsInWishlist = productIdsInWishlist;

    next();
};