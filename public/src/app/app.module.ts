import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { PlayComponent } from './play/play.component';
import { HomeComponent } from './home/home.component';
import { HttpService } from './http.service';
import {HttpClientModule} from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { WebsocketService } from './websocket.service';
import { PlayService } from './play.service'



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ScoreboardComponent,
    PlayComponent,
    HomeComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    HttpService,
    WebsocketService,
    PlayService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
