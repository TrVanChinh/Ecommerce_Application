import { HttpClient } from '@angular/common/http';
import { sha1 } from '@angular/compiler/src/i18n/digest';
import { Injectable } from '@angular/core';
import { share } from 'rxjs';
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

  getProduct (){
    return this.http.get<any>(`${environment.appUrl}/products`).pipe(share());
  }

  getOneProduct (id:string | null){
    return this.http.get<any>(`${environment.appUrl}/product/detail/${id}`).pipe(share());
  }

  getProductbyidCategory (idCategory:any){
    return this.http.get<any>(`${environment.appUrl}/product/category/${idCategory}`);
  }


  DeleteProduct (idproduct:string){
    return this.http.delete<any>(`${environment.appUrl}/seller/deleteProduct/${idproduct}`);
  }

  ///seller/showShopProduct/:idShop
}
