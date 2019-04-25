import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  editUser: any;
  response: any;
  constructor(private _httpService: HttpService, private router: Router, private _loginService: LoginService) {
    if ('user' in sessionStorage){
      console.log('user in session',JSON.parse(sessionStorage.getItem('user')))
      this.editUser = JSON.parse(sessionStorage.getItem('user'))
    }else{
      this.router.navigate(['/login'])
    }

   }
  
  ngOnInit() {
  }

  onEdit(){
    console.log('Attempting Edit of ', this.editUser)
    if(this.editUser.name.length == 0 || this.editUser.password.length == 0){
      this.response= "Password and name must exist"
    }else{
      let observable = this._httpService.editUser(this.editUser);
    observable.subscribe(data =>{
      console.log('got edit user back', data)
      console.log(data['message'])
      if(data['message'] == "Success"){
        console.log('edit success')
      sessionStorage.setItem('user', JSON.stringify(data['data']))
      this.editUser = data['data']
      this._loginService.emitChange();
      this.router.navigateByUrl('/')
    }else{
      this.response=data['data']
    }
    })
    }
    
  }
  onDelete(){
    console.log('Attempting Delete of ', this.editUser)
    let observable = this._httpService.deleteUser(this.editUser);
    observable.subscribe(data =>{
      console.log('got delete user back', data)
      console.log(data['message'])
      if(data['message'] == "Success"){
        console.log('delete success')
      sessionStorage.removeItem('user')
      this.editUser = null;
      this._loginService.emitChange();
      this.router.navigateByUrl('/')
    }else{
      this.response=data['data']
    }
    })
  }
}
