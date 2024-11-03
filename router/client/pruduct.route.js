const express = require("express")
const route = express.Router()
const Controller= require("../../controller/client/product.controller")
route.get('/',Controller.index)
route.get('/:slug',Controller.detail)
module.exports = route