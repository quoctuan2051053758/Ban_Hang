const express = require("express")
const route = express.Router()

const controller = require("../../controller/admin/product-category.controller")

const multer = require("multer")

const upload =multer()
const validate = require("../../validates/admin/product-category.validate")
const uploadCound=require("../../middlewares/admin/uploadCloud.middleware")

route.get('/',controller.index)
route.get('/create',controller.create)
route.patch('/change-status/:status/:id',controller.changeStatus)
route.post(
    '/create',
    upload.single('thumbnail'),
    uploadCound.upload,
    validate.createPost,
    controller.createPost
);
module.exports = route