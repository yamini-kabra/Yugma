const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const userRoute = require("./routes/user");
const errorController = require('./controllers/404');
app.set('view engine' , 'ejs');
const path = require('path');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoute);

app.use(errorController.get404page);

mongoose.connect(
    'mongodb+srv://Yugma:Yugma@cluster0.8nojn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(result => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});