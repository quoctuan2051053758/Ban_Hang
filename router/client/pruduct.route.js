const express = require("express")
const route = express.Router()
const Controller= require("../../controller/client/product.controller")
route.get('/',Controller.index)
route.get('/:slugCategory',Controller.category)
route.get('/detail/:slugProduct',Controller.detail)
module.exports = route