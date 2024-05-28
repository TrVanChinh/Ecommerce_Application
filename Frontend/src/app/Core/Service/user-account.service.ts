import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Observer, shareReplay, tap } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class UserAccountService {

  loggedIn : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  seller : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient, private router:Router) {}

  signUp(data: any) {
    return this.http.post<any>(`${environment.appUrl}/user/signup`, data)
  }

  Login(data: any) {
    return this.http.post<any>(`${environment.appUrl}/user/signin`, data).pipe(
      shareReplay(),
      tap((res) => {
        if(res.data[0].role === "seller"){
          this.seller.next(true)
        }
        if (res.data[0]._id && res.data[0].name) {
          const userId = res.data[0]._id;
          const nameUser = res.data[0].name;
          const role = res.data[0].role;
          const email = res.data[0].email;

          if (userId) {
            localStorage.setItem('userId', userId);
            localStorage.setItem('nameUser', nameUser);
            localStorage.setItem('role',role);
            localStorage.setItem('email',email);

            this.loggedIn.next(true)
          } else {
            console.error('Invalid response format. Tokens are missing.');
          }
        }
      })
    );
  }

  verifyEmail(data: any) {
    return this.http.post<any>(`${environment.appUrl}/user/verify`, data);
  }


  logout(){
    localStorage.removeItem('userId');
    localStorage.removeItem('nameUser');
    localStorage.removeItem('role');
    localStorage.removeItem('email');

    this.router.navigate(["/login"])
    this.loggedIn.next(false);
  }

}
