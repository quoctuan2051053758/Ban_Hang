const express = require("express")
const route = express.Router()
const controller = require("../../controller/client/wishlist.controller")

route.get('/',controller.index)
route.get('/toggle/:productId',controller.add)
route.get('/remove/:productId',controller.remove)
// route.get('/:slug',controller.detail)
module.exports = route