import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  addOrder(data: any) {
    return this.http.post<any>(`${environment.appUrl}/user/order`, data).pipe(
      catchError(error => {
        console.error('Error occurred while placing order:', error);
        return throwError(error);
      })
    );
  }

  payment(priceGlobal: number) {
    return this.http.post<any>(`${environment.appUrl}/user/create-payment-web`, { priceGlobal }).pipe(
      catchError(error => {
        console.error('Error occurred while processing payment:', error);
        return throwError(error);
      })
    );
  }

  getOrder(userId: any) {
    return this.http.get<any>(`${environment.appUrl}/user/getOrder/${userId}`)
  }
  getOrderById(id: any) {
    return this.http.get<any>(`${environment.appUrl}/order/showOrderDetail/${id}`)
  }

  cancelOrder(orderId: string) {
    return this.http.post<any>(`${environment.appUrl}/user/getOrder/cancelOrder`, { orderId })
  }

  confirmOrder(orderId: string) {
    return this.http.post<any>(`${environment.appUrl}/user/getOrder/confirmOrder`, { orderId })
  }

  getOrderbyShop(shopId:string|null){
    return this.http.get<any>(`${environment.appUrl}/order/showOrdersByShop/${shopId}`)
  }

  changeStatusOrder(orderId : string | null, status : string){
    return this.http.put<any>(`${environment.appUrl}/order/changeStatusOrder`, { orderId ,status })
  }
}
