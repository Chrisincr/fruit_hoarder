import { Component, OnInit, Input} from '@angular/core';
import { HttpService } from '../http.service'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { LoginService } from '../login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginUser: any;
  response: any;
  @Input() user: any;
  constructor(private _httpService: HttpService, private router: Router, private _loginService: LoginService) { }

  ngOnInit() {
    this.loginUser = {name: "", password: ""}
  }

  onLogin(){
    console.log('Attempting Login of ', this.loginUser)
    let observable = this._httpService.loginUser(this.loginUser);
    observable.subscribe(data =>{
      console.log('got login user back', data)
      if(data['message'] == 'success'){
      sessionStorage.setItem('user', JSON.stringify(data['data']))
      this.user = data['data']
      this._loginService.emitChange();
      this.router.navigateByUrl('/')
    }else{
      this.response=data['data']
    }
    })
  }

}
