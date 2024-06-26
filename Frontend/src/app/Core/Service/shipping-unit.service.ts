import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShippingUnitService {

  constructor(private http:HttpClient) { }


  getshippingUnit(){
    return this.http.get<any>(`${environment.appUrl}/shippingUnit`);
   }
}
