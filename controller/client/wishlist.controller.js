const Product = require("../../model/product.model")
const productsHelper= require("../../helpers/products")
const Wishlist = require("../../model/wishlish.model")
const paginationHelper = require("../../helpers/pagination")

module.exports.index =async (req,res)=>{
    const userId = res.locals.user.id
    const wishlist = await Wishlist.findOne({ user_id: userId });
    if (!wishlist) {
        return res.render('wishlist', { products: [] });
    }
    const productIds = wishlist.product_id.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    res.render('client/pages/wishlist/index',{
        pageTitle:"Sản phẩm yêu thích",
        products :products 
    });
}

module.exports.add =async (req,res)=>{
    
    const productId = req.params.productId;
    const userId = res.locals.user.id; // Giả sử bạn đã xác thực người dùng

        let wishlist = await Wishlist.findOne({ user_id: userId });

        // Nếu không tồn tại wishlist, tạo mới
        if (!wishlist) {
            wishlist = new Wishlist({ user_id: userId });
        }

        // Kiểm tra sản phẩm đã có trong wishlist chưa
        const exists = wishlist.product_id.some(item => item.productId === productId);

        if (exists) {
            // Nếu đã có, xóa sản phẩm
            wishlist.product_id = wishlist.product_id.filter(item => item.productId !== productId);
            await wishlist.save();
            req.flash('success', 'Sản phẩm đã được xóa khỏi danh sách yêu thích.');
            res.redirect("back")
        } else {
            // Nếu chưa có, thêm sản phẩm
            wishlist.product_id.push({ productId });
            await wishlist.save();
            req.flash('success', 'Sản phẩm đã được thêm vào danh sách yêu thích.');
            res.redirect("back")
        };
}

module.exports.remove =async (req,res)=>{
    
    const productId = req.params.productId;
    const userId = res.locals.user.id; 
    try {
        // Sử dụng phương thức pull để xóa sản phẩm
        await Wishlist.updateOne(
            { user_id: userId },
            { $pull: { product_id: { productId: productId } } } 
        );

        req.flash('success', 'Sản phẩm đã được xóa khỏi danh sách yêu thích.');
        res.redirect('back'); 
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm khỏi wishlist:', error);
        res.redirect('back');
    }
}