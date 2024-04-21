import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdminManagerService {

  constructor(private http: HttpClient) { }
  
  addAdmin(data:any) {
    console.log(data)
    return this.http.post<any>(`${environment.appUrl}/admin/addAdmin`,data);
  }

  AdminSignIn(data:any) {
    console.log(data)
    return this.http.post<any>(`${environment.appUrl}/admin/signin`,data).pipe(
      shareReplay(),
      tap((res)=>{
        const userId = res.data[0]._id;
        if (userId ) {
          localStorage.setItem('IdAdmin',userId)
        } else {
          console.error("Invalid response format. Tokens are missing.");
        }
      })
    )
  }

  getAdmin() {
    return this.http.get<any>(`${environment.appUrl}/admin/showAdmin`);
  }

}
