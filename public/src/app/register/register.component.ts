import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { NgForm } from '@angular/forms'
import {Router} from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  newUser: any;
  constructor(private _httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.newUser = {name: "", password: ""}
  }

  onRegister(){
    console.log('Registered new user', this.newUser)
    let observable = this._httpService.registerUser(this.newUser);
    observable.subscribe(data =>{
      console.log('got registered user back', data['data'])
      this.router.navigateByUrl('/login')
    })
  }


}
