import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  constructor(private http: HttpClient) { }

  signUp(data:any) {
    console.log(data)

    return this.http.post<any>(`${environment.appUrl}/user/signup`,data);
  }

  Login(data:any) {
    console.log(data)
    return this.http.post<any>(`${environment.appUrl}/user/signin`,data);
  }
}
