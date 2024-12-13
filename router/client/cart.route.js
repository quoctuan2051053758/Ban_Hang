const express = require("express")
const route = express.Router()
const controller = require("../../controller/client/cart.controller")

route.get('/',controller.index)


route.post('/add/:productId',controller.add)
route.get('/delete/:productId/:productSize/:productColor',controller.delete)

route.get('/update/:productId/:productSize/:productColor/:quantity',controller.update)



module.exports = route