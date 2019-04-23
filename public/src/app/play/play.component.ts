import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { PlayService } from '../play.service';
import { LoginService } from '../login.service';
import { Key } from 'protractor';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  private socket: any;
  private activeUser: any;

  private fruit: any;

  constructor(private play: PlayService, private _loginService: LoginService) {

    if ('user' in sessionStorage){
      this.activeUser = JSON.parse(sessionStorage.getItem('user'))
    }else{
      this.activeUser ={name: ""}
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
    this.play.messages.subscribe(msg => {
      console.log(msg['action'])
      switch(msg['action']){
        case 'addfruit':{
          console.log('add fruit',msg.data.fruit,'id:',msg.data.points)
        }
      }
      console.log('data to client is',msg)
    })
    
  }
  lemonClicked(){
    
  }


  appleClicked(){
    console.log('apple clicked')
    this.play.appleClicked(this.activeUser)
  }
}
