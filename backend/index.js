const express=require('express');
const http = require('http');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const helmet = require('helmet');
var useragent = require('express-useragent');
var path = require('path');

//route intialisation
const userRouter =require('../bloodbank/routes/userRouter')


var app=express();
app.use(cors());
app.use(helmet());
app.options('*',cors());
app.use(useragent.express());

var server= http.createServer(app);

const port=process.env.PORT ||5000;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://glenpjose2001:glen24riya@cluster0.xhx0d.mongodb.net/bloodbank?retryWrites=true&w=majority',
{   useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DataBase connected.");
    console.log("Fetched Live Data.")
},
err => {
    console.log("db connection error");
    console.log(err)
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});



//middleware
app.use(function (req, res, next) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl)
    next();
})
app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '150mb' }));
app.set('view engine', 'ejs');

app.get('/u/:id', (req, res) => {
    s3.readFile(res, req.params.id)
    return;
});
app.get('/wp/:id', (req, res) => {
    if (req.params.id) {
        if (path.extname(req.params.id) === ".svg") {
            s3.readFile(res, req.params.id)
            return;
        }
    }

    s3.readFile(res, ('wp_' + req.params.id + ".webp"))
    return;
});

//app.use
app.use(userRouter)

app.get('/health', async (req, res) => {
    res.send({
        status: true,
        d: Date.now(),
        msg: "Use API end point!"
    });
    res.end();
});

server.listen(port, () => {
    console.log(`Server with ws capability running on port ${port}`);
    console.log("Database Connection Initiated")
});