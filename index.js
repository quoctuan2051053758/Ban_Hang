const express = require('express')

const route = require("./router/client/index.route")
const admin = require("./router/admin/index.route")

require('dotenv').config()
const database=require("./config/database")

const systemConfig = require("./config/system")

database.connect()

const app= express()
const port= process.env.PORT


app.set('views','./views');
app.set('view engine','pug')

route(app);
admin(app);

// app locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(express.static("public"))   

app.listen(port,()=>{
    console.log('on port ',port);
})