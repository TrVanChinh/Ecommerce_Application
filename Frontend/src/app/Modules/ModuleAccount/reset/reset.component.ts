import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAccountService } from 'src/app/Core/Service/user-account.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  ResetForm!: FormControl;
  OTPform!: FormControl;
  ResetPassword!: FormControl;
  dataUser: { userId: string, email: string } | undefined;
  showOtp:boolean = false
  showReset:boolean = false

  constructor(private userLogin: UserAccountService, private router:Router) { }

  ngOnInit(): void {
    this.ResetForm = new FormControl('', [Validators.required, Validators.email]);
    this.OTPform = new FormControl('', [Validators.required]);
    this.ResetPassword = new FormControl('', [Validators.required]);


  }

  onSubmit(): void {
    const data = {
      email: this.ResetForm.value
    }


    this.userLogin.emailAuthentication(this.ResetForm.value).subscribe(res => {
      console.log(res)
      this.dataUser = res.data.userId
      this.showOtp = true
      console.log(this.dataUser)
    })
  }

  onSubmitOTP(){
    const userId = ""
    const data = {
      userId : this.dataUser, 
      otp: this.OTPform.value
    }
    console.log(data)
    this.userLogin.verifyOTPofForgotPassword(data).subscribe(res => {
      console.log(res)
      this.showOtp = false
      this.showReset = true
    })
  }

  onSubmitReset(){
    const data = {
      userId : this.dataUser, 
      password : this.ResetPassword.value
    }
    console.log(data)
    this.userLogin.setupPassword(data).subscribe(res => {
      console.log(res)
      this.router.navigate(['/login'])
    })
  }
}
