const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require('path');
const bcrypt = require('bcrypt')
var session = require('sessionstorage');
const hashPass = async (pass)=>{
    let hash = await bcrypt.hash(pass,10)
    return hash
}
mongoose.connect('mongodb://localhost/fruit_hoarder');
var UserSchema = new mongoose.Schema({
    name: {type: String},
    password: {type: String}
},{timestamps: true})
mongoose.model('User', UserSchema);
var User = mongoose.model('User');

var app = express();

app.use(bodyParser.json());
app.use(express.static( __dirname + '/public/dist/public' ));


const server = app.listen(8000, function(){
    console.log('listening on port 8000')
})

app.post('/', async function(request,response){
    user = new User()
    user.name = request.body.name
    user.password = await hashPass(request.body.password)
    await user.save()
    .then (v =>{
        response.json({
            message: 'Success',
            data: v
        })
    })
    .catch(e =>{
        response.json({
            message: 'Error',
            data: e
        })
    })
})

app.put('/:num', async function(request,response){
    user = await User.findByIdAndUpdate(request.params.num,{name: request.body.name}, async function(err, data){
        if(err){
            console.log('error updating ', num, 'is', err)
        }else{
            console.log('success updating', data)
            return data
        }
    })
})
app.post('/login', async function(request,response){
    console.log('in /login',request.body)
    await User.findOne({name: request.body.name}, async function(err, user){
        if(err){
            console.log('error finding user by name', request.body.name, 'is', err)
        }else{
            bcrypt.compare(request.body.password,user.password,function(err, res){
                if(err){
                    console.log('error checking password is ',err)
                }else{
                    if(res){
                        session.setItem('user', user)
                        console.log(session.getItem('user'))
                        response.json({
                            message: 'success',
                            data: user
                        })
                    }
                }
            })
        }
    })
})
app.all('*', function(request,response){
    response.sendFile(path.resolve("./public/dist/public/index.html"))
})