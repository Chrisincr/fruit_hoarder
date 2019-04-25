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
    let previousGameId;
    const safeJoin = currentGameId => {
        socket.leave(previousGameId);
        socket.join(currentGameId);
        previousGameId = currentGameId;
    }
    //socket.join(gameId)
    
    io.to(gameId).emit('message', 'welcome')
    

    socket.on('message', data => {
        switch(data.action){
            case 'fruitClicked':
            console.log(data.data.fruit, 'clicked by',data.data.user)
            socket.emit('addPoint')
            io.to(data.data.gameId).emit('removeFruit',{fruit:data.data.fruit})
            break;
            case 'startGame':
            console.log('startgame clicked')
            game = new Game(gameId)
            io.to(gameId).emit('newGame', game)
            console.log('starting game', game)
            playgame(game)
            gameId++
            break;
            case 'joinGame':
            safeJoin(gameId);
            io.to(gameId).emit('newPlayer')
            break;
        }
        console.log('message recieved:',data)
    })

    
})

async function playgame(game){
    
    let fruitid= 1
    progressGame(game,fruitid)

}

function progressGame(game,fruitid){
    
    
    let count = game.fruit.length
    if(count > 0){
        setTimeout(function(){
            let vh = Math.floor(Math.random() * 71) + 10
            let vw = Math.floor(Math.random() * 81) + 10
            io.to(game.gameId).emit('addfruit',{name: game.fruit.pop(),id: fruitid,top:vh+'%',left:vw+'%'})
            count--
            fruitid++
            progressGame(game,fruitid)
        },1000)
    }else{
        
        io.to(game.gameId).emit('gameOver',game.gameId)
    }
}

class Game{
    constructor(id){
        this.fruit =['cherry','apple','lemon','cherry','apple','lemon','cherry','apple','lemon']
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

app.patch('/user', async function(request,response){
    user = await User.findById(request.body._id)
    console.log(request.body)
    console.log(user)
    if(user.name != request.body.name){
        user.name = request.body.name
    }
    if(user.password != request.body.password){
        user.password = await hashPass(request.body.password)
    }
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
            if(!user){response.json({
                message: 'failure',
                data: 'login failed'
            })}else{
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
                        }else{
                            response.json({
                                message: 'failure',
                                data: 'login failed'
                            })
                        }
                    }
                })
            }
            
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