import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category } from '../model/Category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategory() {
    return this.http.get<any>(`${environment.appUrl}/admin/showCategory`);
  }

  addCategory(name: string): Observable<any> {   
    console.log(name);
    return this.http.post<any>(`${environment.appUrl}/admin/newCategory`, { name });
  }
  

  DeleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${environment.appUrl}/admin/deleteCategory`, { body: { categoryId } });
  }
  

  UpdateCategory(data:any) {
    return this.http.put<any>(`${environment.appUrl}/admin/updateCategory`,data);
  }

}
