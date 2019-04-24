import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs'
import { Subject} from 'rxjs'
import { environment } from '../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;

  constructor() { }

  connect(): Subject<MessageEvent>{
    this.socket = io(environment.ws_url);

    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        //console.log('Recieved a message from websocket server');
        observer.next(data)
      })
      this.socket.on('newGame',(data)=>{
        observer.next({'action':'newGame','data': data})
      })
      this.socket.on('addfruit', (data)=>{
        //console.log('Recieved add fruit message from ws server')
        observer.next({'action':'addfruit','data': data})
      })
      this.socket.on('removeFruit', (data)=>{
        //console.log('Recieved remove fruit message from ws server')
        observer.next({'action':'removefruit','data': data})
      })
      this.socket.on('newPlayer', (data) =>{
        //console.log('Recieved newPlayer from ws server')
        observer.next({'action':'newPlayer','data': data})
      })
      this.socket.on('startGame', (data) =>{
       //console.log('Recieved start from websocket server');
        observer.next(data)
      })
      this.socket.on('gameOver', (data)=>{
        console.log('Recieved gameOver from ws server')
        observer.next({'action': 'gameOver','data':data})
      })


      return () => {
        this.socket.disconnect();
      }
    })

    let observer = {
      next: (data: Object) => {
        this.socket.emit('message', data)
      },
      
    }
    return Subject.create(observer, observable)
  }
}
