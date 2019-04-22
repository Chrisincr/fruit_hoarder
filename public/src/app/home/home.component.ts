import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router'
import { LoginService } from '../login.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() user: any;
  constructor(private _httpService: HttpService,private router: Router, private _loginService: LoginService) { }

  ngOnInit() {
  }

  onLogout(){
    console.log('Attempting Logout of ', this.user)
    let observable = this._httpService.logoutUser();
    observable.subscribe(data =>{
      //console.log('got login user back', data['data'])
      sessionStorage.removeItem('user')
      this.user = {name: ""}
      this._loginService.emitChange();
      this.router.navigateByUrl('/')
    })
  }
}
