import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { PlayService } from '../play.service';
import { LoginService } from '../login.service';
import { Key, $ } from 'protractor';
import { Router} from '@angular/router'

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  private socket: any;
  private activeUser: any;
  private waiting: any;
  private fruits: any;
  private gameId: any;
  private ready: any;
  private points: any;

  constructor(private play: PlayService, private _loginService: LoginService,private router: Router) {
    this.waiting = true;
    if ('user' in sessionStorage){
      console.log('user in session',JSON.parse(sessionStorage.getItem('user')))
      this.activeUser = JSON.parse(sessionStorage.getItem('user'))
    }else{
      this.router.navigate(['/login'])
    }


    _loginService.changeEmitted$.subscribe(data => {
      
      if ('user' in sessionStorage){
        this.activeUser = JSON.parse(sessionStorage.getItem('user'))
      }else{
        this.activeUser ={name: ""}
      }
      
      
    })
  }

  ngOnInit() {
    this.points = 0
    this.fruits = []
    this.play.messages.subscribe(msg => {
      //console.log(msg['action'])
      switch(msg['action']){
        case 'addfruit':{
          console.log('add fruit',msg.data.fruit,'id:',msg.data.id)
          this.fruits.push(msg.data)
          break;
        }
        case 'removefruit':{
          console.log('remove fruit',msg.data)
          let index = this.fruits.indexOf(this.findFruitById(msg.data.fruit.id))
          console.log('index',index)
          this.fruits.splice(index,1)
          break;
        }
        case 'newGame':{
          console.log('newgame',msg)
          this.gameId=msg.data.gameId
          this.ready = false;
          break;
        }
        case 'newPlayer':{
          console.log('newPlayer',msg)
          this.waiting = false;
          this.ready = true;
          break;
        }
        case 'gameOver':{
          console.log('gameOver',msg)
          this.fruits=[]
          this.gameId=null;
          this.waiting = true;
          break;
        }
        case 'addPoint':{
          console.log('point scored')
          this.points++
          break;
        }

      }
      console.log('data to client is',msg)
    })
    
  }

  findFruitById(id){
    for(let fruit in this.fruits){
      console.log('fruit',this.fruits[fruit])
      if(this.fruits[fruit]['id'] == id){
        return this.fruits[fruit]
      }
    }
  }

  joinGame(){
    this.fruits = []
    this.play.joinGame()

  }
  startGame(){
    this.play.startGame()
  }

  fruitClicked(fruitId){
    console.log('fruit clicked',fruitId)
    let fruit = this.findFruitById(fruitId)
    this.play.fruitClicked({fruit: fruit,user:this.activeUser,gameId:this.gameId})
  }
}
