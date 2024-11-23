const express = require('express')
const methodOverride = require('method-override')
const path  = require("path")

const bodyParser = require("body-parser")
const cookieParser=require("cookie-parser")
const session=require("express-session")
const route = require("./router/client/index.route")
const admin = require("./router/admin/index.route")
const flash=require("express-flash")
const moment = require("moment")
require('dotenv').config()
const database=require("./config/database")

const systemConfig = require("./config/system")

database.connect()

const app= express()
const port= process.env.PORT

app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static(`${__dirname}/public`))   

app.set('views',`${__dirname}/views`);
app.set('view engine','pug')



//express-flash
app.use(cookieParser('ahlaaaa'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

route(app);
admin(app);
app.get("*",(req,res)=>{
    res.render("client/pages/errors/404",{
        pageTitle:"404 Not Found"
    })
})


//end tinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//App locals Variabless

// app locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment



app.listen(port,()=>{
    console.log('on port ',port);
})