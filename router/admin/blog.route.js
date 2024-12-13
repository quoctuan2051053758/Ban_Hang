const express = require("express")
const route = express.Router()
const controller = require("../../controller/admin/blog.controller")
const multer = require("multer")
const upload =multer()
const uploadCound=require("../../middlewares/admin/uploadCloud.middleware")
const validate = require("../../validates/admin/product.validate")


route.get('/',controller.index)
route.get('/create',controller.create)

route.post(
    '/create',
    upload.single('thumbnail'),
    uploadCound.uploadSingle,
    validate.createPost,
    controller.createPost
);
route.post(
    '/create',
    upload.single('thumbnail'),
    uploadCound.uploadSingle,
    validate.createPost,
    controller.createPost
);
route.get('/edit/:id',controller.edit)
route.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    uploadCound.uploadSingle,
    validate.createPost,
    controller.editPatch
);
module.exports = route