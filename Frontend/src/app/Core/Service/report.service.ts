import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient,) { }

  getRevenueByMonth(shopId:string | null , month:number , year:number) {
    return this.http.get<any>(`${environment.appUrl}/seller/revenueByMonth/${shopId}/${month}/${year}`)
  }

  getRevenueByYear(shopId:string | null , year:number) {
    return this.http.get<any>(`${environment.appUrl}/seller/revenueByYear/${shopId}/${year}`)
  }

  profitByYear(shopId:string | null , year:number) {
    return this.http.get<any>(`${environment.appUrl}/seller/profitByYear/${shopId}/${year}`)
  }


  getinventory(idproduct:string , year:number) {
    return this.http.get<any>(`${environment.appUrl}/seller/inventoryStatsByMonth/${idproduct}/${year}`)
  }

  getOrderCompletedByYear(id: string |null  , year: number) {

    const body = { id, year };

    // return this.http.get<any>(`${environment.appUrl}/user/getOrderCompletedByYear`,{body});
    return this.http.post<any>(`${environment.appUrl}/user/getOrderCompletedByYear`, body);
  }

  revenueByCustomer(shopId:string | null , month:number , year:number) {
    return this.http.get<any>(`${environment.appUrl}/seller/revenueByCustomer/${shopId}/${month}/${year}`)
  }
}
