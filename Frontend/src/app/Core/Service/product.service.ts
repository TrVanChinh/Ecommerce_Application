import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }


  uploadImg(images: File[]) {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    return this.http.post<any>(`${environment.appUrl}/upload/productImage`, formData);
  }
  addProduct(data: any) {
    return this.http.post<any>(`${environment.appUrl}/seller/addProduct`, data);
  }


  ListProductShop (idShop:string|null){
    return this.http.get<any>(`${environment.appUrl}/seller/showShopProduct/${idShop}`);
  }
  ///seller/showShopProduct/:idShop
}
