const express = require("express")
const route = express.Router()
const controller = require("../../controller/admin/inventory.controller")

route.get('/',controller.index)

route.get('/add',controller.create)

module.exports = route