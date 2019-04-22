import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class HttpService {
  

  constructor(private _http: HttpClient) {
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

}
