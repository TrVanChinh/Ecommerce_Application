import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { verify } from 'crypto';
import { UserAccountService } from 'src/app/Service/user-account.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signInForm! : FormGroup;
  userid: string = "";
  Verify: boolean = false;
  inputVerify:string ="";
  constructor(private userService:UserAccountService, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      username: '',
      password: '',
      email: '',
    });
  }

  onSubmit(): void {
    const data = {
      name: this.signInForm.value.username,
      email:this.signInForm.value.email,
      password:this.signInForm.value.password
    }
    this.userService.signUp(data).subscribe(data=>{
      this.userid = data.data.userId;
      this.Verify = true;
    })
  }

  VerifyEmail(){
      const data = {
        userId: this.userid,
        otp:this.inputVerify
      }
      this.userService.verifyEmail(data).subscribe(res =>{
        console.log(res)
      })
  }

}
