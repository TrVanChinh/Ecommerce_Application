import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, shareReplay, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  seller : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userId: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router:Router,private toastr: ToastrService ) {}


  profileUser(id: string| null) {
    return this.http.get<any>(`${environment.appUrl}/shop/user/${id}`)
  }

  UpdateprofileUser(data:any) {
    return this.http.put<any>(`${environment.appUrl}/user/updateUser`,data).pipe(
      tap(res => {
        this.toastr.success('Cập nhật hồ sơ thành công!');
      })
    )
  }
  
  uploadAvatar(data:any){

    console.log(data)
    return this.http.put<any>(`${environment.appUrl}/upload/avatar`, data);
  }
  
  updatelProfileSeller(data: any) {
    return this.http.put<any>(`${environment.appUrl}/seller/updateShop`,data)
  }

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

            this.userId.next(userId);
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
  }

  emailAuthentication(email: string){
    return this.http.post<any>(`${environment.appUrl}/user/emailAuthentication`, {email});
  }

  verifyOTPofForgotPassword(data: any){
    return this.http.post<any>(`${environment.appUrl}/user/verifyOTPofForgotPassword`, data);
  }

  setupPassword(data: any){
    return this.http.post<any>(`${environment.appUrl}/user/setupPassword`, data);
  }

}
