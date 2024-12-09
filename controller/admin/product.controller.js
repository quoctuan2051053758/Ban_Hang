const Product = require("../../model/product.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const systemConfig= require("../../config/system")
const paginationHelper = require("../../helpers/pagination")
const createTreeHelper = require("../../helpers/createTree")
const ProductCategory=require("../../model/product-category.model")
const Account = require("../../model/account.model")

module.exports.index = async(req,res)=>{
// Nhúng bộ lọc
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted:false
    };
    if(req.query.status){
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);
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


    //sort
    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] =req.query.sortValue
    }else{
        sort.position = "desc"
    }

    
    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
    
    for(const product of products){
        const user =await Account.findOne({
            _id:product.createdBy.account_id
        })
        if(user){
            product.accountFullName=user.fullName;
        }
        
        // Lấy ra thông tin người cập nhật gần nhất
        const updatedBy= product.updatedBy.slice(-1)[0]
        if(updatedBy){
            const userUpdated =await Account.findOne({
                _id:updatedBy.account_id
            })
            updatedBy.accountFullName = userUpdated.fullName
        }
        

    }
    
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
    const updatedBy={
        account_id:res.locals.user.id,
        updatedAt:new Date()
    }
    await Product.updateOne({_id:id},{
        status:status,
        $push:{updatedBy:updatedBy}
    })

    req.flash("success","Cập nhật thành công")
    res.redirect('back');
}

//change-status /admin/product/change-multi
module.exports.changeMulti=async(req,res)=>{
    const type = req.body.type
    const ids = req.body.ids.split(", ")
    const updatedBy={
        account_id:res.locals.user.id,
        updatedAt:new Date()
    }
    switch(type){
        case "active":
            await Product.updateMany({_id : { $in : ids } },{
                status:"active",
                $push:{updatedBy:updatedBy}
            })

            req.flash("success",`Cập nhật trạng thái thành công ${ids.length} sản phẩm`)
            break;
        case "inactive":
            await Product.updateMany({_id : { $in : ids } },{
                status:"inactive",
                $push:{updatedBy:updatedBy}
            })
            req.flash("success",`Cập nhật trạng thái thành công ${ids.length} sản phẩm`)
            break;
        case "delete-all":
            await Product.updateMany(
                {_id : { $in : ids } },
                {
                    deleted:true, 
                    deletedBy:{
                        account_id: res.locals.user.id,
                        deletedAt:new Date(),
                    }
                }   
            )
            req.flash("success",`Đã xóa thành công ${ids.length} sản phẩm`)
            break;
        case "change-position":
            for(const item of ids){
                let[id, position]=item.split("-");
                position = parseInt(position)
                await Product.updateOne({_id: id},{
                    position: position,
                    $push:{updatedBy:updatedBy}
                })
                
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
        deletedBy:{
            account_id: res.locals.user.id,
            deletedAt:new Date(),
        }
    });
    res.redirect('back');
}

//[get] /admin/products/create
module.exports.create = async(req,res)=>{
    const find={
        deleted:false
    }
    const category = await ProductCategory.find(find)
    const newRecords=createTreeHelper.tree(category);
    res.render('admin/pages/products/create',{
        pageTitle:"Thêm mới sản phẩm",
        category:newRecords
    });
}

//[POST] admin/products/create
module.exports.createPost = async(req,res)=>{
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if(req.body.position==""){
        const maxPositionProduct  = await Product.findOne().sort({ position: -1 });
        req.body.position = maxPositionProduct.position  + 1;
    }else{
        req.body.position = parseInt(req.body.position)
    }
    req.body.createdBy={
        account_id : res.locals.user.id
    }
    if (req.body.color) {
        req.body.color = req.body.color.trim(); // Bỏ khoảng trắng thừa
    } else {
        req.body.color = ""; // Hoặc bạn có thể để null nếu không muốn giá trị mặc định
    }
    if (req.body.size) {
        req.body.size = Array.isArray(req.body.size) ? req.body.size : [req.body.size]; // Đảm bảo size là mảng
    } else {
        req.body.size = "freesize";
    }
    const product = new Product(req.body)
    await product.save()
    req.flash("success","Thêm sản phẩm thành công ")
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
        
        const category = await ProductCategory.find({
            deleted:false
        })
        const newRecords=createTreeHelper.tree(category);

    
        res.render('admin/pages/products/edit',{
            pageTitle:"Chỉnh sửa sản phẩm",
            product:product,
            category:newRecords
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
    if (req.body.size) {
        req.body.size = Array.isArray(req.body.size) ? req.body.size : [req.body.size]; // Đảm bảo size là mảng
    } else {
        req.body.size = "freesize";
    }
    try{
        const updatedBy={
            account_id:res.locals.user.id,
            updatedAt:new Date()
        }
        
        await Product.updateOne({_id:id},{
            ...req.body,
            $push: {updatedBy:updatedBy}
        })
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
        res.render('admin/pages/products/detail',{
            pageTitle:product.title,
            product:product
        });
    }catch(error){
        req.flash("error","không tìm thấy sản phẩm")
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
    
}