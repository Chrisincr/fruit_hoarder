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
  response: any;
  newUser: any;
  constructor(private _httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.newUser = {name: "", password: ""}
  }

  onRegister(){
    console.log('Registering new user', this.newUser)
    if(this.newUser.name.length <1 || this.newUser.password.length <1){
      this.response = 'Please enter unique name and password'
    }else{
      let observable = this._httpService.registerUser(this.newUser);
    observable.subscribe(data =>{
      console.log('got registered user back', data)
      if(data['message'] == 'Error'){
        this.response = data['data']
      }else{
        this.router.navigateByUrl('/login')
      }
      
    })
    }
    
  }


}
