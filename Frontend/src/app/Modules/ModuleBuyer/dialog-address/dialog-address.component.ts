import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddressService } from 'src/app/Core/Service/address.service';

@Component({
  selector: 'app-dialog-address',
  templateUrl: './dialog-address.component.html',
  styleUrls: ['./dialog-address.component.css']
})
export class DialogAddressComponent implements OnInit {
  dataProvince: any[] = [];
  dataDistricts: any[] = [];
  dataWards: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private address: AddressService
  ) {}

  ngOnInit(): void {
    this.address.getprovince().subscribe(res => {
      this.dataProvince = res.data;
      console.log(this.dataProvince)

    });
  }

  onProvinceChange(province: any): void {
    this.data.Province = {
      ProvinceName: province.ProvinceName
    };
    console.log(province.ProvinceID,province.ProvinceName)
    this.address.getDistrict(province.ProvinceID).subscribe((res: any) => {
      this.dataDistricts = res.data;
      console.log(this.dataDistricts)
    });
  }

  onDistrictChange(district: any): void {
    
    this.data.District = {
      ProvinceName: district.DistrictName
    };
    this.address.getward(district.DistrictID).subscribe((res: any) => {
      this.dataWards = res.data;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  compareProvinces(province1: any, province2: any): boolean {
    return province1 && province2 ? province1.ProvinceID === province2.ProvinceID : province1 === province2;
  }
  compareDistrict(District1: any, District2: any){
    return District1 && District2 ? District1.DistrictID === District2.DistrictID : District1 === District2;
  }
  compareWards(ward1: any, ward2: any): boolean {
    return ward1 && ward2 ? ward1.WardID === ward2.WardID : ward1 === ward2;
  }
}
