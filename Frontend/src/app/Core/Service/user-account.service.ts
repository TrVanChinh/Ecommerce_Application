import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Observer, shareReplay, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  constructor(private http: HttpClient) {}

  signUp(data: any) {
    return this.http.post<any>(`${environment.appUrl}/user/signup`, data).pipe(
      tap((res) => {
        console.log(res)
        // if (res.data[0]._id) {
        //   const userId = res.data[0]._id;
        //   if (userId) {
        //     localStorage.setItem('userId', userId);
        //   } else {
        //     console.error('Invalid response format. Tokens are missing.');
        //   }
        // }
      })
    );
  }

  Login(data: any) {
    return this.http.post<any>(`${environment.appUrl}/user/signin`, data).pipe(
      shareReplay(),
      tap((res) => {
        if (res.data[0]._id && res.data[0].name) {
          const userId = res.data[0]._id;
          const nameUser = res.data[0].name;
          if (userId) {
            localStorage.setItem('userId', userId);
            localStorage.setItem('nameUser', nameUser);
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
}
