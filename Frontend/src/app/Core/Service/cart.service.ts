import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, catchError, concatMap, forkJoin, from, share, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartLengthSubject = new BehaviorSubject<number>(0);
  cartLength$ = this.cartLengthSubject.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  addProductToCart(data: any) {
    return this.http.post<any>(`${environment.appUrl}/product/addCart`, data).subscribe(res => {
      console.log(res);
      this.updateCartLength();
      this.toastr.success('Add product to Cart successfully!');
    });
  }

  getCart(userId: string | null) {
    return this.http.get<any>(`${environment.appUrl}/Cart/${userId}`).pipe(share());
  }

  deleteCart(data: any) {
    console.log('Deleting cart item:', data);
    return this.http.post(`${environment.appUrl}/cart/removeFromCart-web`, data).pipe(
      tap(response => {
        console.log('Delete cart response:', response);
        this.updateCartLength();
      }),
      catchError(error => {
        console.error('Error in deleteCart:', error);
        return throwError(error);
      })
    );
  }

  updateCartLength() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.getCart(userId).subscribe(res => {
        this.cartLengthSubject.next(res.data.length);
      });
    }
  }

  deleteCartSequentially(cartData: any[]): Observable<any> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('User ID not found in localStorage.');
        return throwError('User ID not found');
    }

    return from(cartData).pipe(
        concatMap(item => {
            console.log('Delete request for item:', item);
            const data = { 
                cartId: item._id, 
                userId: userId 
            };
            return this.deleteCart(data).pipe(
                catchError(error => {
                    console.error('Error occurred while deleting cart item:', error);
                    return throwError(error);
                })
            );
        }),
        tap({
            complete: () => {
                this.updateCartLength();
                console.log('All carts deleted successfully.');
            }
        }),
        catchError(error => {
            console.error('Error occurred during deleteCartSequentially:', error);
            return throwError(error);
        })
    );
}



  increaseQuantity(data: any) {
    return this.http.post(`${environment.appUrl}/cart/increaseQuantity`, data).pipe(
      tap(() => {
        this.updateCartLength();
      })
    );
  }

  decrementQuantity(data: any) {
    return this.http.post(`${environment.appUrl}/cart/decrementQuantity`, data).pipe(
      tap(() => {
        this.updateCartLength();
      })
    );
  }
}
