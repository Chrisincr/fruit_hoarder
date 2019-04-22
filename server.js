const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require('path');
var session = require('express-session');

mongoose.connect('mongodb://localhost/fruit_hoarder');


var app = express();
app.use(session({secret: "I solemly swear I am upto no good!"}));
app.use(bodyParser.json());
app.use(express.static( __dirname + '/public/dist/public' ));


const server = app.listen(8000, function(){
    console.log('listening on port 8000')
})

app.all('*', function(request,response){
    response.sendFile(path.resolve("./public/dist/public/index.html"))
})