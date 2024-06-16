import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAccountService } from 'src/app/Core/Service/user-account.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signInForm! : FormGroup;
  userid: string|null = "";
  Verify: boolean = false;
  inputVerify:string ="";
  
  constructor(private userService:UserAccountService, private fb:FormBuilder, private router:Router) { }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required,Validators.minLength(6)]],
      email: ['',[Validators.required,Validators.email]],
    });
    this.userid = localStorage.getItem('userId');
    if(this.userid){
      this.Verify = true;
    }
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
        this.router.navigate(['/login'])
        console.log(res)
      })
  }

}
