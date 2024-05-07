import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private http:HttpClient) { }

  getSellerPending() {
    return this.http.get<any>(`${environment.appUrl}/admin/showSaleRegister`);
  }

  approveSaleRequest(userId:string){
    return this.http.post<any>(`${environment.appUrl}/admin/approveSaleRequest`,{userId})
  }


}
