const express = require("express")
const route = express.Router()
const controller = require("../../controller/client/about.controller")

route.get('/',controller.index)




module.exports = route