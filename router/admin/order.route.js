const express = require("express")
const route = express.Router()
const controller = require("../../controller/admin/order.controller")


route.get('/',controller.index)

module.exports = route