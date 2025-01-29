const Cart = require("../../model/cart.model")
const Product = require("../../model/product.model")
const productsHelper= require("../../helpers/products");

// [POST] /cart/add/:productId
module.exports.add =async (req,res)=>{
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId=req.cookies.cartId;
    const size= req.body.size;
    const color = req.body.color
    if( !req.body.size || !req.body.color){
        req.flash("error", "Vui lòng chọn kích thước và màu sắc");
        return res.redirect("back")
    }
    const product = await Product.findById(productId);
    if (!product) {
        req.flash("error", "Sản phẩm không tồn tại!");
        return res.redirect("back");
    }
    const cart = await Cart.findOne({
        _id:cartId
    })
    const variant = product.variants.find(v => v.size === size && v.color === color);
    if (!variant) {
        req.flash("error", "Kích thước hoặc màu sắc không hợp lệ!");
        return res.redirect("back");
    }
    // Kiểm tra số lượng tồn kho
    if (quantity > variant.stock) {
        req.flash("error", `Số lượng yêu cầu vượt quá số lượng tồn kho. Tối đa là ${variant.stock}.`);
        return res.redirect("back");
    }

    const existProductInCart = cart.products.find(item=>
        item.product_id==productId &&
        item.color == color && 
        item.size == size
    )
    if(existProductInCart ){
        const quantityNew = quantity + existProductInCart.quantity
        await Cart.updateOne({
            _id:cartId,
            "products.product_id":productId,
            "products.size":size,
            "products.color":color
        },{
            $set:{
                "products.$.quantity":quantityNew
            }
        })
    }else{
        const objectCart={
            product_id:productId,
            quantity:quantity,
            color:color,
            size:size
        } 
        await Cart.updateOne({_id:cartId},{
            $push:{products:objectCart}
        })
    }

    req.flash("success","Đã thêm vào giỏ hàng")
    res.redirect("back")
}


// [GET] /cart
module.exports.index =async (req,res)=>{
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
    res.render('client/pages/cart/index',{
        pageTitle:"Giỏ hàng",
        cartDetail:cart
    });
}


// [GET] /cart/delete/:productId
module.exports.delete =async (req,res)=>{
    const cartId=req.cookies.cartId
    const productId=req.params.productId
    const productSize = req.params.productSize;
    const productColor = req.params.productColor;
    await Cart.updateOne({
        _id:cartId,
    },{
        $pull:{products:{
            product_id:productId,
            size: productSize,
            color: productColor
        }}
    })
    req.flash("success","Đã xóa sản phẩm khỏi giỏ hàng")
    res.redirect("back")
}
// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const productSize = req.params.productSize;
    const productColor = req.params.productColor;
    const quantity = parseInt(req.params.quantity);

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại" });
        }

        const selectedVariant = product.variants.find(variant => 
            variant.size === productSize && variant.color === productColor
        );

        if (quantity > selectedVariant.stock) {
            return res.status(400).json({ error: "Cập nhật không thành công: Số lượng yêu cầu vượt quá tồn kho" });
        }

        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId,
            "products.size": productSize,
            "products.color": productColor
        }, {
            $set: {
                "products.$.quantity": quantity
            }
        });

        return res.json({ success: "Cập nhật số lượng thành công" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Có lỗi xảy ra trong quá trình cập nhật" });
    }
};

