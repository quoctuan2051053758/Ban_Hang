const Product = require("../../model/product.model")
const Inventory = require("../../model/inventory.model")
const Account = require("../../model/account.model")
const generateCreatment = require("../../helpers/generate")
const systemConfig= require("../../config/system")
// const Inventory= require("../../model/inventory.model")


//[GET] inventory
module.exports.index = async (req,res)=>{
    // const inventorys=await Inventory.find()
    const products = await Product.find();
    const inventories = await Inventory.find();
    for(const inventory of inventories){
        const user =await Account.findOne({
            _id:inventory.createdBy.account_id
        })
        if(user){
            inventory.fullName=user.fullName;
        }
    }
    res.render('admin/pages/inventory/index',{
        pageTitle:"Kho hàng",
        // inventorys:inventorys
        products:products,
        inventories:inventories
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



module.exports.addReceiveInventory  = async (req,res)=>{
    const expectedDate = req.body;
    const inventoryStatus = req.body.status ? 'received' : 'pending';
        console.log(req.body)
        // Tạo mã code cho đơn nhập hàng
        const code = await generateCreatment.generateCreatment();
        const items = [];
        let index = 0;

        // Lặp qua các thuộc tính trong req.body
        while (req.body[`items[${index}][variantId]`] !== undefined) {
            const variantId = req.body[`items[${index}][variantId]`];
            const quantityReceived = req.body[`items[${index}][quantityReceived]`];
            const importPrice = req.body[`items[${index}][importPrice]`];

            // Kiểm tra nếu variantId là một mảng hay không
            const variantIds = Array.isArray(variantId) ? variantId : [variantId];

            // Thêm các mặt hàng vào mảng items
            for (const id of variantIds) {
                items.push({
                    variantId: id,
                    quantityAvailable: 0, // Gán giá trị mặc định cho quantityAvailable
                    quantityReceived: Number(quantityReceived),
                    importPrice: Number(importPrice)
                });
            }

            index++;
        }

        // Tạo đối tượng Inventory
        const newInventory = new Inventory({ 
            code: code, // Gán mã với tiền tố
            expectedDate,
            status:inventoryStatus,
            items,
            createdBy: {
                account_id: res.locals.user.id, // Lấy thông tin người dùng từ middleware
            }
        });
        // Lưu vào cơ sở dữ liệu
        await newInventory.save();
        res.redirect("back");
}


//[GET] admin/inventorys/add:id
module.exports.add = async (req,res)=>{
    const inventoryId = req.params.id
    const inventory = await Inventory.findOne({
        _id:inventoryId
    })
    for (const item of inventory.items){
        const { variantId, quantityReceived } = item;
        console.log(variantId)
        await Product.findOneAndUpdate(
            { 'variants._id': variantId },
            { $inc: { 'variants.$.stock': quantityReceived } } // Tăng số lượng tồn kho
        );
        
    }
   
    await Inventory.findByIdAndUpdate(inventoryId, { status: 'completed' });
    res.redirect("back")
    
}


//[GET] admin/inventorys/add:id
module.exports.cancel = async (req,res)=>{
    const inventoryId = req.params.id
    const inventory = await Inventory.findOne({
        _id:inventoryId
    })
    for (const item of inventory.items){
        const { variantId, quantityReceived } = item;
        console.log(variantId)
        await Product.findOneAndUpdate(
            { 'variants._id': variantId },
            { $inc: { 'variants.$.stock':- quantityReceived } } // Tăng số lượng tồn kho
        );
        
    }
    req.flash("success","Đã hủy đơn hàng")
    // Xóa đơn nhập hàng
    await Inventory.findByIdAndDelete(inventoryId);
    res.redirect("back") 
}

//[GET] admin/roles
module.exports.detail = async (req,res)=>{
    const products=await Product.find()
    res.render('admin/pages/inventory/export',{
        pageTitle:"Kho hàng",
        products:products
    });
}
