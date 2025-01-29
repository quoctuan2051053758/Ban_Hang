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
module.exports.import = async (req,res)=>{
    const products=await Product.find()
    res.render('admin/pages/inventory/create',{
        pageTitle:"Tạo đơn nhập",
        products:products
    });
}


module.exports.export = async (req,res)=>{
    const products=await Product.find()
    res.render('admin/pages/inventory/export',{
        pageTitle:"Kho hàng",
        products:products
    });
}



module.exports.addReceiveInventory  = async (req,res)=>{
    const expectedDate = req.body.expectedDate;
    const inventoryStatus = req.body.status ? 'received' : 'pending';
        const code = await generateCreatment.generateCreatment();
        const items = [];
        let index = 0;

        while (req.body[`items[${index}][variantId]`] !== undefined) {
            const variantId = req.body[`items[${index}][variantId]`];
            const quantityReceived = req.body[`items[${index}][quantityReceived]`];
            const importPrice = req.body[`items[${index}][importPrice]`];

            const variantIds = Array.isArray(variantId) ? variantId : [variantId];

            for (const id of variantIds) {
                items.push({
                    variantId: id,
                    quantityAvailable: 0,
                    quantityReceived: Number(quantityReceived),
                    importPrice: Number(importPrice)
                });
            }
            index++;
        }
        const newInventory = new Inventory({ 
            code: code, // Gán mã với tiền tố
            expectedDate,
            status:inventoryStatus,
            items,
            createdBy: {
                account_id: res.locals.user.id,
            }
        });
        req.flash("sucess","Tạo đơn nhập hàng thành công")
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
            { $inc: { 'variants.$.stock': quantityReceived } } 
        );
        
    }
    req.flash("success","Nhập hàng thành công")
    await Inventory.findByIdAndUpdate(inventoryId, { status: 'completed' });
    res.redirect("back")
    
}


//[GET] admin/inventorys/calcel:id
module.exports.cancel = async (req,res)=>{
    const inventoryId = req.params.id
    const inventory = await Inventory.findOne({
        _id:inventoryId
    })
    for (const item of inventory.items){
        const { variantId, quantityReceived } = item;
        await Product.findOneAndUpdate(
            { 'variants._id': variantId },
            { $inc: { 'variants.$.stock':- quantityReceived } }  
        );
    }
    req.flash("success","Đã hủy đơn hàng")
    await Inventory.findByIdAndDelete(inventoryId);
    res.redirect("back") 
}

module.exports.detail = async (req,res)=>{
    const id = req.params.id;
    try {
        // Tìm kiếm thông tin tồn kho dựa trên ID
        const inventory = await Inventory.findById(id);

        if (!inventory) {
            return res.status(404).send('Không tìm thấy mục tồn kho.');
        }
        const productDetails = [];
        // In ra thông tin đơn nhập
        for (const item of inventory.items) {
            // Tìm sản phẩm dựa trên variantId
            const product = await Product.findOne({ "variants._id": item.variantId });
            const variant = product.variants.find(v => v._id.equals(item.variantId));
            if (product) {
                productDetails.push({
                    title: product.title,
                    color: variant.color,
                    size:variant.size,
                    importPrice: item.importPrice,
                    quantityAvailable: item.quantityAvailable,
                    quantityReceived: item.quantityReceived,
                });
            }
        }
        // Truyền dữ liệu vào view
        res.render('admin/pages/inventory/detail', {
            pageTitle: "Chi tiết đơn nhập",
            products:productDetails,
            inventory
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra khi truy xuất dữ liệu.');
    }
}

