const Cart = require("../../model/cart.model")
const Product = require("../../model/product.model")
const Order = require("../../model/order.model")
const productsHelper= require("../../helpers/products");

// [GET] /checkout
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
            if(selectedVariant){
                const discountPrice = selectedVariant.price - (selectedVariant.price * (productInfo.discountPercentage / 100));
                item.price = selectedVariant.price; //
                item.discountPrice = discountPrice;
            }else{
                item.price = 0; // Nếu không tìm thấy variant, gán giá mặc định
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
    // cart.totalPrice = cart.products.reduce((sum,item)=>sum+item.totalPrice,0)
    res.render('client/pages/checkout/index',{
        pageTitle:"Đặt hàng",
        cartDetail:cart
    }); 
}

// [POST] /checkout/order
module.exports.order =async (req,res)=>{
    const cartId=req.cookies.cartId;
    const userInfo = req.body
    const cart = await Cart.findOne({
        _id:cartId
    })
    const products = []
    for(const product of cart.products){
        const objectProduct = {
                product_id:product.product_id,
                price: 0,
                discountPercentage:0,
                quantity: product.quantity,
                size:product.size,
                color:product.color
        }
        const productInfo = await Product.findOne({
            _id:product.product_id
        }).select("price discountPercentage variants")
        const selectedVariant = productInfo.variants.find(variant =>
            variant.color === product.color && variant.size === product.size
        );
        if(selectedVariant){
            // const discountPrice = selectedVariant.price - (selectedVariant.price * (productInfo.discountPercentage / 100));
            const discountPrice = selectedVariant.price - (selectedVariant.price * (productInfo.discountPercentage / 100));
            objectProduct.price = selectedVariant.price;
            objectProduct.discountPercentage = productInfo.discountPercentage;
            objectProduct.totalPrice = discountPrice * product.quantity; // Tính totalPrice

            products.push(objectProduct);
        } else {
            // Nếu không tìm thấy variant, gán giá mặc định và totalPrice = 0
            objectProduct.price = 0;
            objectProduct.discountPercentage = 0;
            objectProduct.totalPrice = 0;
            products.push(objectProduct); // Vẫn thêm sản phẩm vào danh sách
        }
    }
    const orderInfo = {
        cart_id:cartId,
        userInfo:userInfo,
        products:products
    }
    const order = new Order(orderInfo);
    order.save()
    await Cart.updateOne({
        _id:cartId    
    },{
        products:[]
    });
    res.redirect(`/checkout/success/${order.id}`)

}

// [GET] /checkout/success/:orderId
module.exports.success =async (req,res)=>{
    const order = await Order.findOne({
        _id:req.params.orderId
    })
    for(const product of order.products){
        const productInfo = await Product.findOne({
            _id:product.product_id
        }).select("title thumbnail price discountPercentage")
        product.productInfo=productInfo


        product.priceNew=productsHelper.priceNewProduct(product)
        product.totalPrice =product.priceNew * product.quantity
        product.priceNewFormatted = product.priceNew.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        product.totalPriceFormatted = product.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    }
    order.totalPrice = order.products.reduce((sum,item)=>sum+item.totalPrice,0)
    order.totalPriceFormatted = order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    // order.totalPrice = 
    res.render('client/pages/checkout/success',{
        pageTitle:"Đặt hàng Thành công",
        order:order

    });
}
// [GET] /checkout/history
module.exports.history =async (req,res)=>{
    const orders = await Order.find({
        cart_id:req.cookies.cartId
    })
    for(const order of orders){
        for(const product of order.products){
            const productInfo = await Product.findOne({
                _id: product.product_id
            })
            product.productInfo= productInfo
            product.price = product.price - (product.price*product.discountPercentage/100)
            product.totalPrice = product.price *product.quantity
        }
        order.totalPrice = order.products.reduce((sum,item)=>sum+item.totalPrice,0)
        order.totalPriceFormatted = order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    
    res.render('client/pages/checkout/history',{
        pageTitle:"Đơn đã đặt",
        orders:orders
    });
}