const Product = require("../../model/product.model")
const systemConfig= require("../../config/system")
const Inventory= require("../../model/inventory.model")


//[GET] inventory
module.exports.index = async (req,res)=>{
    const inventorys=await Inventory.find()
    res.render('admin/pages/inventory/index',{
        pageTitle:"Kho hàng",
        inventorys:inventorys
    });
}
//[GET] admin/roles
module.exports.import = async (req,res)=>{
    const products=await Product.find()
    res.render('admin/pages/inventory/create',{
        pageTitle:"Kho hàng",
        products:products
    });
}

//[GET] admin/roles
module.exports.export = async (req,res)=>{
    const products=await Product.find()
    res.render('admin/pages/inventory/export',{
        pageTitle:"Kho hàng",
        products:products
    });
}