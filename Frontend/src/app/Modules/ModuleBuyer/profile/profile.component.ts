import { Component, OnInit } from '@angular/core';
import { AddressService } from 'src/app/Core/Service/address.service';
import { DialogAddressComponent } from '../dialog-address/dialog-address.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from 'src/app/Core/Service/product.service';
import { UserAccountService } from 'src/app/Core/Service/user-account.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  FormProfile!: FormGroup;
  userId:string | null = "";
  dataAddress:any[] = [];
  data:any[] = []
  selectedImages: string[] = [];
  URLImg: string = "";
  dataprofile:any|null = null;
  constructor(
    private addressService:AddressService, 
    public dialog: MatDialog, 
    private productSevice:ProductService,
    private userService:UserAccountService,
    private fb: FormBuilder,
  ) { }


  ngOnInit(): void {
    this.FormProfile = this.fb.group({
      name: '',
      email: '',
      dateOfBirth: '',
    });
    this.userId = localStorage.getItem('userId')
    this.getprofileUser();
    this.getAddress()

   
  }

  async onSubmit() {
    try {
        const data = {
            id: this.userId,
            name: this.FormProfile.value.name,
            dateOfBirth: this.FormProfile.value.dateOfBirth
        };

        // Gửi yêu cầu cập nhật thông tin người dùng
        this.userService.UpdateprofileUser(data).subscribe((res: any) => {
            console.log(res);
        }, (error) => {
            console.error('Error updating user profile:', error);
        });

        // Gửi yêu cầu upload avatar nếu có hình ảnh được chọn
        if (this.selectedImages.length > 0) {
            const img = this.selectedImages[0];
            const blob = await fetch(img).then((r) => r.blob());
            const file = new File([blob], 'avatar.jpg');

            // Gửi yêu cầu POST với FormData chứa userId và file ảnh
            const formData = new FormData();
            formData.append('userId', this.userId!);
            formData.append('image', file);

            this.userService.uploadAvatar(formData).subscribe((res: any) => {
                console.log(res);
            }, (error) => {
                console.error('Error uploading avatar:', error);
            });
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}


  getprofileUser(){
    this.userService.profileUser(this.userId).subscribe((res:any) => {
      console.log(res.data.avatarUrl)
      this.dataprofile = res.data
      if (this.dataprofile) {
        this.FormProfile.patchValue({
          name: this.dataprofile.name,
          email: this.dataprofile.email,
          dateOfBirth: this.dataprofile.dateOfBirth
        });
      }
    })
  }

  getAddress(){
    this.addressService.getAddess(this.userId).subscribe((res:any) => {
      this.dataAddress =res.data
      console.log(this.dataAddress)
    })
  }
  openAddressDialog(): void {
    const dialogRef = this.dialog.open(DialogAddressComponent, {
      width: '500px',
      data: this.data, 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataAddress = result;
        console.log(this.dataAddress)
        const data = {
          userId : this.userId,
           name  :result.name, 
           street : result.sonha, 
           Ward : result.ward.WardName, 
           District :result.District.ProvinceName, 
           city : result.Province.ProvinceName, 
           mobileNo: result.phone
        }

        this.addressService.newAddess(data).subscribe(res => {
          console.log(res)
          this.getAddress()
        })
      }
    });
  }

  DeleteAddress(idAddress:string){
    const data = {
      userId :this.userId, 
      addressId : idAddress
    }
    this.addressService.DeleteAddess(data).subscribe(res => {
      console.log(res)
      this.getAddress()
    })
  }

  showPreview(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') { // Kiểm tra kiểu của kết quả
          // Lưu dữ liệu URL vào mảng selectedImages
          this.selectedImages.push(result);
        }
      };
      reader.readAsDataURL(files[0]); // Đọc chỉ một tệp, vì chỉ có thể chọn một tệp trong phần tử input này
    }
  }
  
  

  async processImg() {
    const imageFiles: File[] = this.selectedImages.map((image) =>
      this.dataURItoFile(image, 'image.png')
    );
    const res = await this.productSevice.uploadImg(imageFiles).toPromise();
    this.URLImg = res.imageUrls;
  }

  dataURItoFile(dataURI: string, filename: string): File {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: 'image/png' }); // Adjust type if needed

    return new File([blob], filename);
  }
}
