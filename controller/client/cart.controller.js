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

    const cart = await Cart.findOne({
        _id:cartId
    })

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
            }).select("title thumbnail slug price discountPercentage")
            productInfo.priceNew=productsHelper.priceNewProduct(productInfo)
            item.productInfo = productInfo
            item.totalPrice = productInfo.priceNew * item.quantity
        }   
    }
    cart.totalPrice = cart.products.reduce((sum,item)=>sum+item.totalPrice,0)
    res.render('client/pages/cart/index',{
        pageTitle:"Giỏ hàng",
        cartDetail:cart
    });
}


// [GET] /cart/delete/:productId
module.exports.delete =async (req,res)=>{
    const cartId=req.cookies.cartId
    const productId=req.params.productId
    await Cart.updateOne({
        _id:cartId,
    },{
        $pull:{products:{product_id:productId}}
    })
    req.flash("success","Đã xóa sản phẩm khỏi giỏ hàng")
    res.redirect("back")
}
// [GET] /cart/update/:productId/:quantity
module.exports.update =async (req,res)=>{
    const cartId=req.cookies.cartId
    const productId=req.params.productId
    const productSize = req.params.productSize;
    const productColor = req.params.productColor;
    const quantity=parseInt(req.params.quantity)
    try{
        const product = await Product.findById(productId);
        if (!product) {
            req.flash("error", "Sản phẩm không tồn tại");
            return res.redirect("back");
        }
            const cart = await Cart.findOne({ _id: cartId });
            // Tính tổng số lượng sản phẩm trong giỏ hàng
            
            const currentQuantity = cart.products.reduce((total, item) => {
                if (item.product_id === productId && item.size === productSize && item.color === productColor) {
                    return total + quantity; // Sẽ cập nhật số lượng mới
                }
                return total + item.quantity;
            }, 0);

            // Kiểm tra số lượng tồn kho
            if (currentQuantity > product.stock) { // Giả sử `product.stock` là số lượng tồn kho
                req.flash("error", "Số lượng yêu cầu vượt quá tồn kho");
                return res.redirect("back");
            }
        }catch(error){
        console.error(error);
        req.flash("error", "Có lỗi xảy ra trong quá trình cập nhật");

        }
    await Cart.updateOne({
        _id:cartId,
        "products.product_id":productId,
        "products.size": productSize,
        "products.color": productColor
    },{
        $set:{
            "products.$.quantity":quantity
        }
    })
    req.flash("success","Cập nhật số lượng thành công")
    res.redirect("back")
}

