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
    this.activeUser = false;
    _loginService.changeEmitted$.subscribe(data => {
      //console.log('in change emitted')
      //console.log(sessionStorage.getItem('user'))
      this.activeUser = JSON.parse(sessionStorage.getItem('user'))
      //console.log('active user',this.activeUser)
    })
  }

  onLogin(user){
    this.activeUser = user;
  }
}
