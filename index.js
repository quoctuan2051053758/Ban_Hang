const express = require('express')
const app= express()
const port= 3000


app.set('views','./views');
app.set('view engine','pug')
app.get('/',(req,res)=>{
    res.render('client/pages/home/index',{titlePage:'trang chủ'});
})
app.get('/product',(req,res)=>{
    res.render('client/pages/products/index',{titlePage:'trang chủ'});
})

app.listen(port,()=>{
    console.log('on port ',port);
})