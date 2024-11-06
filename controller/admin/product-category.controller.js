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
    console.log(req.body)
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