const express = require("express")
const route = express.Router()
const controller = require("../../controller/admin/inventory.controller")

route.get('/',controller.index)

route.get('/import',controller.import)
route.get('/export',controller.export)
module.exports = route