const express = require('express')
const route = require("./router/client/index.route")
require('dotenv').config()


const app= express()
const port= process.env.PORT


app.set('views','./views');
app.set('view engine','pug')
route(app);

app.listen(port,()=>{
    console.log('on port ',port);
})