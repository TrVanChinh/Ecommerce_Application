import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SellAccountService } from 'src/app/Core/Service/sell-account.service';

@Component({
  selector: 'app-seller-register',
  templateUrl: './seller-register.component.html',
  styleUrls: ['./seller-register.component.css']
})
export class SellerRegisterComponent implements OnInit {
  signInForm! : FormGroup;
  userId : string|null = "";
  message:string = "";
  hashedOTP:string = "";
  constructor(private fb:FormBuilder ,private sellerService:SellAccountService, private router:Router) { }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      shopDescript: '',
      shopAddress: '',
      shopName: '',
      otp:'',
    });
  }


  onSubmit(){
    if(localStorage.getItem('userId')){
      this.userId = localStorage.getItem('userId')
    }
    const data = {
      shopDescript: this.signInForm.value.shopDescript,
      shopAddress:this.signInForm.value.shopAddress,
      shopName:this.signInForm.value.shopName,
      userid:this.userId
    }
    this.sellerService.Register(data).subscribe(res => {
      console.log(res)
    })

    const dataOTP = {
      otp: this.signInForm.value.otp,
      hashedOTP:this.hashedOTP
    }
    this.sellerService.Verify(dataOTP).subscribe(res => {
      console.log(res)
      this.router.navigate(['/login'])
    })

    
 
  }

  sendcode(){

    const email = localStorage.getItem('email')
    this.sellerService.SendCode(email).subscribe(res => {
      console.log(res)
      this.message = res.message; 
      this.hashedOTP = res.data.hashedOTP;
      console.log(this.message)
      console.log(this.hashedOTP)
    })

  }
}
