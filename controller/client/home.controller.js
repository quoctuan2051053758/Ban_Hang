const Product= require("../../model/product.model")
const ProductCategory = require("../../model/product-category.model")
const productsCategoryHelper= require("../../helpers/product-category");
const productsHelper= require("../../helpers/products")
// GET
module.exports.index = async(req,res)=>{
    // lấy danh sách nổi bật
    const productsFeatured = await Product.find({
        featured:"1",
        deleted:false,
        status:"active"
    }).limit(6)
    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)

    // lấy ra danh sách sản phẩm mới nhất
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
                acc[variant.color] = []; // Khởi tạo mảng cho màu sắc nếu chưa có
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

    
        // Gán các thuộc tính đã xử lý vào sản phẩm
        const productDetail = {
            ...product.toObject(), // Sao chép tất cả các thuộc tính của sản phẩm
            variants,              // Thêm thuộc tính variants
            sizesByColor,         // Thêm thuộc tính sizesByColor
            uniqueColors          // Thêm thuộc tính uniqueColors
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
    }).limit(4)


    const woment = await ProductCategory.findOne({
        slug:"thoi-trang-nu"
    })
    const listSubCategoryAccessory= await productsCategoryHelper.getSubCategory(woment._id) 
    const listSubCategoryAccessoryId = listSubCategoryAccessory.map(item=>item.id)
    const productWoment = await Product.find({
                product_category_id:{$in:[woment.id,...listSubCategoryAccessoryId]},
                deleted:false
    }).limit(4)
    const man = await ProductCategory.findOne({
        slug:"thoi-trang-nam"
    })
    const listSubCategoryMan= await productsCategoryHelper.getSubCategory(man._id)
    
    const listSubCategoryManId = listSubCategoryMan.map(item=>item.id)
    const productMan = await Product.find({
                product_category_id:{$in:[man.id,...listSubCategoryManId]},
                deleted:false
    }).limit(4)
    

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