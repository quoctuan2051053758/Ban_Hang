const Product = require("../../model/product.model")
const productsHelper= require("../../helpers/products");
const ProductCategory = require("../../model/product-category.model");
const productsCategoryHelper= require("../../helpers/product-category");
const paginationHelper = require("../../helpers/pagination")
module.exports.index = async(req,res)=>{

    const countProducts = await Product.countDocuments({
        status : "active",
        deleted:false
    })
    let objectPagination=paginationHelper(
        {
            currentPage:1,
            limitItems:9
        },
        req.query,
        countProducts
    )
    const products = await Product.find({
        status : "active",
        deleted:false
    }).sort({position:"desc"})
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    res.render('client/pages/products/index',{
        pageTitle:"Trang danh sách sản phẩm",
        products:products,
        pagination:objectPagination
        // discountedPrice:discountedPrice
    });
}

//[GET] /products/:slugProduct

module.exports.detail = async(req,res)=>{
    // try{
        const find = {
            deleted:false,
            slug:req.params.slugProduct,
            status:"active"
        }
        
        const product = await Product.findOne(find)
        if (!product) {
            return res.redirect("/products");
        } 
        
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
                discountPrice: variant.price - (variant.price * (product.discountPercentage / 100)),
                stock: variant.stock // Thêm số lượng sản phẩm cho biến thể
            });
            return acc;
        }, {});
        let category = null;
        const uniqueColors = Object.keys(sizesByColor);
        if(product.product_category_id){
            category = await ProductCategory.findOne({
                _id:product.product_category_id,
                status:"active",
                deleted:"false"
            })
        //    product.category = category
        }
        const relatedProducts = await Product.find({
            product_category_id:category.id,
            _id: { $ne: product._id }
        })
        console.log(relatedProducts)
        res.render('client/pages/products/detail',{
            pageTitle:product.title,
            product: {
                ...product.toObject(), // Chuyển đổi mongoose document sang object để dễ sử dụng
                variants: variants,
                sizesByColor: sizesByColor,
                uniqueColors: uniqueColors,
                category: category,

            },
            relatedProducts:relatedProducts
        });
        
    // }catch(error){
    //     res.redirect("/products")
    // }
}

//[GET] /products/:slugCategory

module.exports.category = async(req,res)=>{  
        const category = await ProductCategory.findOne({
            slug:req.params.slugCategory,
            status:"active",
            deleted:false
        })
        const listSubCategory= await productsCategoryHelper.getSubCategory(category.id)
        
        const listSubCategoryId = listSubCategory.map(item=>item.id)
        
        const countProducts = await Product.countDocuments({
            product_category_id:{$in:[category.id,...listSubCategoryId]},
            deleted:false
        })
        let objectPagination=paginationHelper(
            {
                currentPage:1,
                limitItems:9
            },
            req.query,
            countProducts
        )
        const products = await Product.find({
            product_category_id:{$in:[category.id,...listSubCategoryId]},
            deleted:false
        }).sort({position:"desc"})
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
        const newProducts = productsHelper.priceNewProducts(products)
        
        res.render('client/pages/products/index',{
            pageTitle:category.title,
            products:newProducts,
            pagination:objectPagination
        });
    // }catch(error){
    //     res.redirect("/products")
    // }
}
