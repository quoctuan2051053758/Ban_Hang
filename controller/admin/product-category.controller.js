const ProductCategory=require("../../model/product-category.model")
const systemConfig= require("../../config/system")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const createTreeHelper = require("../../helpers/createTree")
module.exports.index = async(req,res)=>{
    const filterStatus = filterStatusHelper(req.query)
    let find={
        deleted:false

    }
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex
    }
    if(req.query.status){
        find.status = req.query.status;
    }

    const records = await ProductCategory.find(find)
    const newRecords=createTreeHelper.tree(records);
    res.render('admin/pages/products-category/index',{
        pageTitle:"Danh sách sản phẩm",
        records:newRecords,
        filterStatus:filterStatus,
    });
}
module.exports.changeStatus=async(req,res)=>{
    const status = req.params.status;
    const id = req.params.id;
    await ProductCategory.updateOne({_id:id},{status:status})

    req.flash("success","Cập nhật thành công")
    res.redirect('back');
}
module.exports.create = async(req,res)=>{
    let find ={
        deleted:false
    }

    const records = await ProductCategory.find(find)
    const newRecords=createTreeHelper.tree(records);
    

    res.render('admin/pages/products-category/create',{
        pageTitle:"Tạo danh mục sản phẩm",
        records:newRecords
    });
}
module.exports.createPost = async(req,res)=>{
    if(req.body.position==""){
        const count = await ProductCategory.countDocuments()
        req.body.position = count + 1;
    }else{
        req.body.position = parseInt(req.body.position)
    }
    const record = new ProductCategory(req.body)
    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}

//[GET] /admin/products-category/edit/:id
module.exports.edit = async(req,res)=>{
    try{
        const id = req.params.id
        const data= await ProductCategory.findOne({
            _id: id,
            deleted:false
        })
        const records = await ProductCategory.find({
            deleted:false
        })
        const newRecords=createTreeHelper.tree(records);
        res.render('admin/pages/products-category/edit',{
            pageTitle:"Chỉnh sửa danh mục",
            data: data,
            records:newRecords
    });
    }catch{
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
}

//[Patch] /admin/products-category/edit/:id
module.exports.editPatch = async(req,res)=>{
    const id = req.params.id
    req.body.position=parseInt(req.body.position)

    try{
        await ProductCategory.updateOne({_id:id,},req.body)
    }catch{

    }
    res.redirect("back")
    
}
module.exports.detail = async(req,res)=>{
    const find = {
        _id:req.params.id,
        deleted:false
    }

    const product = await ProductCategory.findOne(find)
    res.render('admin/pages/products-category/detail',{
        pageTitle:"Danh mục",
        product:product
    });
}