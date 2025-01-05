const express = require("express")
const route = express.Router()
const controller = require("../../controller/admin/account.controller")
const multer = require("multer")
const upload =multer()
const uploadCound=require("../../middlewares/admin/uploadCloud.middleware")
const validate = require("../../validates/admin/account.validate")


route.get('/',controller.index)
route.get('/create',controller.create)
route.post('/create',
    upload.single('avatar'),
    uploadCound.upload,
    validate.createPost,
    controller.createPost
)
route.get('/edit/:id',controller.edit)
route.patch('/edit/:id',
    upload.single('avatar'),
    uploadCound.upload,
    validate.editPatch,
    controller.editPatch
)
route.delete('/delete/:id',controller.deleteAccount)
module.exports = route