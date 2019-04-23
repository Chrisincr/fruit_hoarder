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

const io = require('socket.io')(server);
let gameId = 10
io.on('connection', function(socket){
    let game = null;
    socket.join(gameId)
    
    io.to(gameId).emit('message', 'welcome')
    

    socket.on('message', data => {
        switch(data.action){
            case 'fruitClicked':
            console.log(data.data.fruit, 'clicked by',data.data.user)
            io.to(data.data.gameId).emit('removeFruit',{fruit:data.data.fruit})
            break;
            case 'startGame':
            console.log('startgame clicked')
            game = new Game(gameId)
            io.to(gameId).emit('newGame', game)
            console.log('starting game', game)
            playgame(gameId)
            gameId++
            break;
        }
        console.log('message from',data)
    })

    
})

async function playgame(gameId){
    fruitid= 1
    let count = 11
    progressGame(gameId,count,fruitid)

}

function progressGame(gameId,count,fruitid){
    if(count > 1){
        setTimeout(function(){
            let vh = Math.floor(Math.random() * 61) + 10
            let vw = Math.floor(Math.random() * 61) + 20
            io.to(gameId).emit('addfruit',{name: 'lemon',id: fruitid,top:vh+'vh',left:vw+'vw'})
            count--
            fruitid++
            progressGame(gameId,count,fruitid)
        },1000)
    } 
}

class Game{
    constructor(id){
        this.fruit =['apple','apple','lemon']
        this.gameId = id
    }

    progress(){
        if (this.fruit.length){
            return this.fruit.pop
        }
        return (this.gameover())    
    }
    gameover(){
        return null
    }
}


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

app.get('/logout',function(request,response){
    session.removeItem('user')
    response.json({
        message: 'success',
        data: {name: ''}
    })
})

app.all('*', function(request,response){
    response.sendFile(path.resolve("./public/dist/public/index.html"))
})