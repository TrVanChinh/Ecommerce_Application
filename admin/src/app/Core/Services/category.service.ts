import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategory() {
    return this.http.get<any>(`${environment.appUrl}/admin/showCategory`);
  }
  getCategorybyID(id:string) {
    return this.http.get<any>(`${environment.appUrl}/admin/Category/${id}`);
  }

  addCategory(name: string): Observable<any> {   
    console.log(name);
    return this.http.post<any>(`${environment.appUrl}/admin/newCategory`, { name });
  }
  

  DeleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${environment.appUrl}/admin/deleteCategory`, { body: { categoryId } });
  }
  

  UpdateCategory(categoryId:string, name:string ) {
    return this.http.put<any>(`${environment.appUrl}/admin/updateCategory`,{categoryId , name});
  }

 


  addSubCategory(name: string, categoryId:string|null): Observable<any> {   
    return this.http.post<any>(`${environment.appUrl}/admin/newSubCategory`, { name , categoryId});
  }

  DeleteSubCategory(subCategoryId:string,categoryId: string|null): Observable<any> {
    return this.http.delete<any>(`${environment.appUrl}/admin/deleteSubCategory`, { body: {subCategoryId, categoryId } });
  }

  UpdateSubCategory(categoryId:string|null,subCategoryId:string, newName:string ) {
    return this.http.put<any>(`${environment.appUrl}/admin/UpdateSubCategory`,{categoryId ,subCategoryId, newName});
  }
}
