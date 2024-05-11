import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellAccountService {

  constructor(private http:HttpClient) { }


  Register(data: any) {
    return this.http.post<any>(`${environment.appUrl}/user/SaleRegister`, data)
  }

  SendCode(email: any) {
    return this.http.post<any>(`${environment.appUrl}/user/sendOTPVerificationEmailSeller`, { email })
  }

  Verify(data: any) {
    return this.http.post<any>(`${environment.appUrl}/user/verifyOTPSeller`, data)
  }


}
