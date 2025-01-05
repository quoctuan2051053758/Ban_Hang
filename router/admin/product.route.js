const express = require("express")
const multer = require("multer")
const upload =multer()
const route = express.Router()

const controller = require("../../controller/admin/product.controller")
const validate = require("../../validates/admin/product.validate")

const uploadCound=require("../../middlewares/admin/uploadCloud.middleware")

route.get('/',controller.index)
route.patch('/change-status/:status/:id',controller.changeStatus)
route.patch('/change-multi',controller.changeMulti)
route.delete('/delete/:id',controller.deleteItem)

route.get('/create',controller.create)
route.post(
    '/create',
    upload.array('thumbnail',10),
    uploadCound.upload,
    validate.createPost,
    controller.createPost
);
route.get('/edit/:id',controller.edit)
route.patch(
    '/edit/:id',
    upload.array('thumbnail',10),
    uploadCound.upload,
    validate.createPost,
    controller.editPatch
)
route.get('/detail/:id',controller.detail )
route.get('/product-delete',controller.productdelete)
route.get('/restore/:id',controller.productRestore)
route.get('/deleteItem/:id',controller.delete)

module.exports = route