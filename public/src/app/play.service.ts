import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service'
import { Observable, Subject } from 'rxjs'
import {map} from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class PlayService {

  messages: Subject<any>;

  constructor(private wsService: WebsocketService) { 
    this.messages = <Subject<any>>wsService
    .connect()
    
  }

  appleClicked(msg) {
    this.messages.next(msg)
  }
} 
