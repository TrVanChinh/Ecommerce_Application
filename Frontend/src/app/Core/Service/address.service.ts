import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, share } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private token: string = "30dee1e2-a7c8-11ee-a59f-a260851ba65c";
  private readonly ROOT_URL: string = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/province';

  constructor(private http: HttpClient) {}

  getprovince(): Observable<any> {
    const headers = new HttpHeaders().set('Token', this.token);
    return this.http.get(this.ROOT_URL, { headers }).pipe(share());
  }
  getDistrict(provinceId:string){
    const headers = new HttpHeaders().set('Token', this.token);
    return this.http.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,{headers}).pipe(
      share()
    )
  }

  getward(districtId:string){
    const headers = new HttpHeaders().set('Token', this.token);
    return this.http.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,{headers}).pipe(
      share()
    )
  }

  newAddess(data:any){
    return this.http.post(`${environment.appUrl}/user/newAddress`, data)
  }
  
  getAddess(userId:string | null){
    return this.http.get(`${environment.appUrl}/user/${userId}/getAddress`)
  }

  DeleteAddess(data:any){
    return this.http.post(`${environment.appUrl}/user/deleteAddress`,data)
  }
  
}

