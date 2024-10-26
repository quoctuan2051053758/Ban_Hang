const express = require("express")
const route = express.Router()
const productController= require("../../controller/client/product.controller")
route.get('/',productController.index)
module.exports = route