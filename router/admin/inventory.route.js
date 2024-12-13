const express = require("express")
const route = express.Router()
const controller = require("../../controller/admin/inventory.controller")

route.get('/',controller.index)

route.get('/import',controller.import)
route.get('/export',controller.export)
route.get('/enter/:id',controller.add)
route.get('/cancel/:id',controller.cancel)
route.get('/detail/:id',controller.detail)
route.post("/addReceiveInventory", controller.addReceiveInventory);
module.exports = route