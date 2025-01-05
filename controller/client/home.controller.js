const Product= require("../../model/product.model")
const ProductCategory = require("../../model/product-category.model")
const productsCategoryHelper= require("../../helpers/product-category");
const productsHelper= require("../../helpers/products")
// GET
module.exports.index = async(req,res)=>{
    const productsFeatured = await Product.find({
        featured:"1",
        deleted:false,
        status:"active"
    }).limit(6).sort({ createdAt: -1 })
    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)

    const productsNew = await Product.find({
        deleted:false,
        status:"active"
    }).sort({position:"desc"}).limit(4)

    const newproductsNew = productsHelper.priceNewProducts(productsNew)
    const productDetails = [];
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
                acc[variant.color] = []; 
            }
            acc[variant.color].push({
                size: variant.size,
                price: variant.price,
                stock: variant.stock,
                discountPrice: (variant.price - (variant.price * (product.discountPercentage / 100))).toFixed(2)
            });
            return acc;
        }, {});
        // Tạo danh sách màu sắc duy nhất từ sizesByColor
        const uniqueColors = Object.keys(sizesByColor);

    
        const productDetail = {
            ...product.toObject(), 
            variants,              
            sizesByColor,         
            uniqueColors          
        };
        productDetails.push(productDetail);
    }

    const accessory = await ProductCategory.findOne({
        slug:"phu-kien"
    })

    const listSubCategory= await productsCategoryHelper.getSubCategory(accessory._id)
        
    const listSubCategoryId = listSubCategory.map(item=>item.id)
    const productAccessory = await Product.find({
                product_category_id:{$in:[accessory.id,...listSubCategoryId]},
                deleted:false
    }).limit(4).sort({ createdAt: -1 })
    const woment = await ProductCategory.findOne({
        slug:"thoi-trang-nu"
    }).sort({ createdAt: -1 })
    const listSubCategoryAccessory= await productsCategoryHelper.getSubCategory(woment._id) 
    const listSubCategoryAccessoryId = listSubCategoryAccessory.map(item=>item.id)
    const productWoment = await Product.find({
                product_category_id:{$in:[woment.id,...listSubCategoryAccessoryId]},
                deleted:false
    }).limit(4).sort({ createdAt: -1 })
    const man = await ProductCategory.findOne({
        slug:"thoi-trang-nam"
    })
    const listSubCategoryMan= await productsCategoryHelper.getSubCategory(man._id)
    const listSubCategoryManId = listSubCategoryMan.map(item=>item.id)
    const productMan = await Product.find({
                product_category_id:{$in:[man.id,...listSubCategoryManId]},
                deleted:false
    }).limit(4).sort({ createdAt: -1 })
    
    res.render('client/pages/home/index',{
        pageTitle:"Trang chủ",
        productsFeatured:newProductsFeatured,
        productsNew:newproductsNew,
        products: productDetails,
        productMan:productMan,
        productWoment:productWoment,
        productAccessory:productAccessory
    });
}