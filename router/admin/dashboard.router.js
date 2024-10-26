const express = require("express")
const route = express.Router()
const controller = require("../../controller/admin/dashboard.controller")

route.get('/',controller.dashboard)

module.exports = route