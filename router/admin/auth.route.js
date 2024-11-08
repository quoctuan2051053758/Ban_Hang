const express = require("express")
const route = express.Router()
const controller = require("../../controller/admin/auth.controller")
const validate = require("../../validates/admin/auth.validate")

route.get('/login',controller.login)
route.post('/login',validate.loginPost,controller.loginPost)

module.exports = route