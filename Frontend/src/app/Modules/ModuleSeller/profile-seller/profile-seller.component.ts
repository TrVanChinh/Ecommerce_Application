import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/Core/Service/product.service';
import { UserAccountService } from 'src/app/Core/Service/user-account.service';

@Component({
  selector: 'app-profile-seller',
  templateUrl: './profile-seller.component.html',
  styleUrls: ['./profile-seller.component.css']
})
export class ProfileSellerComponent implements OnInit {
  userId:string | null = "";
  dataprofile:any|null = null;
  FormProfile!: FormGroup;
  selectedImages: string[] = [];
  URLImg: string = "";
  constructor(private userService:UserAccountService,
    private fb: FormBuilder,
    private productSevice:ProductService,
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    this.getprofileUser()
    this.FormProfile = this.fb.group({
      email:'',
      shopName: '',
      shopAddress: '',
      shopDescript: '',
    });
  }
  //id, avatarUrl, shopName, shopAddress, shopDescript
  getprofileUser(){
    this.userService.profileUser(this.userId).subscribe((res:any) => {
      console.log(res.data)
     this.dataprofile = res.data
     if (this.dataprofile) {
      this.FormProfile.patchValue({
        email: this.dataprofile.email,
        shopName: this.dataprofile.shopName,
        shopAddress: this.dataprofile.shopAddress,
        shopDescript: this.dataprofile.shopDescript

      });
    }
      
    })
  }

 async onSubmit(){
   await this.processImg()
   const img = this.URLImg[0]
    const data = {
      id : this.userId,
      avatarUrl :img,
      shopName :this.FormProfile.value.shopName, 
      shopAddress:this.FormProfile.value.shopAddress,
      shopDescript:this.FormProfile.value.shopDescript
    }

    console.log(data)
    this.userService.updatelProfileSeller(data).subscribe(res => {
      console.log(res)
      this.getprofileUser()
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
