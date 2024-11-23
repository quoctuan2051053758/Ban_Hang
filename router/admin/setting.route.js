const express = require("express")
const route = express.Router()
const multer = require("multer")
const upload =multer()
const uploadCound=require("../../middlewares/admin/uploadCloud.middleware")
const controller = require("../../controller/admin/setting.controller")

route.get('/general',controller.general)
route.patch('/general',
    upload.single('logo'),
    uploadCound.upload,
    controller.generalPatch)

module.exports = route