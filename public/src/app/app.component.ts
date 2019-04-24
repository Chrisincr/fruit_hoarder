import { Component } from '@angular/core';
import { HttpService } from './http.service'
import { LoginService } from './login.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fruit Hoarder';
  activeUser: any;
  constructor(private _httpService: HttpService, private _loginService: LoginService){
    if ('user' in sessionStorage){
      console.log('user in session',JSON.parse(sessionStorage.getItem('user')))
      this.activeUser = JSON.parse(sessionStorage.getItem('user'))
    }else{
      this.activeUser = {name: ''};
    }
    
    _loginService.changeEmitted$.subscribe(data => {
      //console.log('in change emitted')
      //console.log(sessionStorage.getItem('user'))
      if ('user' in sessionStorage){
        this.activeUser = JSON.parse(sessionStorage.getItem('user'))
      }else{
        this.activeUser ={name: ""}
      }
      
      //console.log('active user',this.activeUser)
    })
  }

  onLogin(user){
    this.activeUser = user;
  }
}
