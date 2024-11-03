const Product = require("../../model/product.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const systemConfig= require("../../config/system")
const paginationHelper = require("../../helpers/pagination")
// const multer = require("multer")

module.exports.index = async(req,res)=>{

    
// Nhúng bộ lọc
    const filterStatus = filterStatusHelper(req.query);
    // console.log(filterStatus)

    let find = {
        deleted:false
    };
    if(req.query.status){
        find.status = req.query.status;
    }
    

    const objectSearch = searchHelper(req.query);
    // console.log(objectSearch)
    if(objectSearch.regex){
        find.title = objectSearch.regex
    }
    
    //pagination
    const countProducts = await Product.countDocuments(find)
    let objectPagination=paginationHelper(
        {
            currentPage:1,
            limitItems:4
        },
        req.query,
        countProducts
    )



    //End Pagination
    const products = await Product.find(find)
        .sort({position:"desc"})
        .limit(objectPagination.limitItems)
            .skip(objectPagination.skip)

    res.render('admin/pages/products/index',{
        pageTitle:"Danh sách sản phẩm",
        products:products,
        filterStatus:filterStatus,
        keyword:objectSearch.keyword,
        pagination:objectPagination
    });
}

//change-status
module.exports.changeStatus=async(req,res)=>{
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({_id:id},{status:status})

    req.flash("success","Cập nhật thành công")
    res.redirect('back');
}

//change-status /admin/product/change-multi
module.exports.changeMulti=async(req,res)=>{
    const type = req.body.type
    const ids = req.body.ids.split(", ")
    switch(type){
        case "active":
            await Product.updateMany({_id : { $in : ids } },{status:"active"})
            req.flash("success",`Cập nhật trạng thái thành công ${ids.length} sản phẩm`)
            break;
        case "inactive":
            await Product.updateMany({_id : { $in : ids } },{status:"inactive"})
            req.flash("success",`Cập nhật trạng thái thành công ${ids.length} sản phẩm`)
            break;
        case "delete-all":
            await Product.updateMany({_id : { $in : ids } },{deleted:true, deletedAt: new Date()})
            req.flash("success",`Đã xóa thành công ${ids.length} sản phẩm`)
            break;
        case "change-position":
            for(const item of ids){
                let[id, position]=item.split("-");
                position = parseInt(position)
                await Product.updateOne({_id: id},{position: position})
                
            }
            req.flash("success",`Đã đổi vị trí thành công ${ids.length} sản phẩm`)
            break;
        default:
            break;
    }
    
    res.redirect('back');
}
module.exports.deleteItem=async(req,res)=>{
    const id = req.params.id
    await Product.updateOne({_id : id },{
        deleted: true,
        deletedAt: new Date()
    });
    res.redirect('back');
}

//[get] /admin/products/create
module.exports.create = async(req,res)=>{
    res.render('admin/pages/products/create',{
        pageTitle:"Thêm mới sản phẩm",
    });
}

//[POST] admin/products/create
module.exports.createPost = async(req,res)=>{
    
    // if(req.body.title.length<8){
    //     req.flash("error","Vui lòng nhập tiêu đề ít nhất 8 ký tự")
    //     res.redirect("back")
    //     return
    // }
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    if(req.body.position==""){
        const countProducts = await Product.countDocuments()
        req.body.position = countProducts + 1;
    }else{
        req.body.position = parseInt(req.body.position)
    }
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    const product = new Product(req.body)
    await product.save()
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

//[GET] admin/product/edit/:id
module.exports.edit = async(req,res)=>{
    try{
        const find = {
            deleted:false,
            _id:req.params.id
        }
        const product = await Product.findOne(find)
    
        res.render('admin/pages/products/edit',{
            pageTitle:"Chỉnh sửa sản phẩm",
            product:product
        });
    }catch(error){
        req.flash("error","không tìm thấy sản phẩm")
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
    
}

// [PATCH]  admin/product/edit/:id
module.exports.editPatch = async(req,res)=>{
    const id = req.params.id
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    try{
        await Product.updateOne({_id:id},req.body)
        req.flash("success","Cập nhật thành công sản phẩm")
    }catch{
        req.flash("error","Cập nhật thất bại")
    }
    res.redirect("back")
}


//[GET] admin/products/detail
module.exports.detail = async(req,res)=>{
    try{
        const find = {
            deleted:false,
            _id:req.params.id
        }
        const product = await Product.findOne(find)
        console.log(product)
        res.render('admin/pages/products/detail',{
            pageTitle:product.title,
            product:product
        });
    }catch(error){
        req.flash("error","không tìm thấy sản phẩm")
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
    
}