import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class HttpService {
  
  
  

  constructor(private _http: HttpClient) {
    }
    deleteUser(editUser: any) {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: editUser,
      };
      return this._http.delete('/user',options);
    }
    editUser(editUser: any) {
      return this._http.patch('/user',editUser);
    }
  
  registerUser(newUser: any){
    return this._http.post('/',newUser);
  }
  updateUser(updateUser: any){
    
    return this._http.put('/'+updateUser._id,updateUser);
  }
  loginUser(user:any){
    return this._http.post('/login',user)
  }
  logoutUser(){
    return this._http.get('/logout')
  }

}
