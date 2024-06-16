import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAccountService } from 'src/app/Core/Service/user-account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm! : FormGroup;
  constructor(private userLogin:UserAccountService, private fb:FormBuilder,private router:Router) { }

  ngOnInit(): void {
     this.LoginForm = this.fb.group({
      email:['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]],
    });
  }
  
  onSubmit(): void {
    const data = {
      email:this.LoginForm.value.email,
      password:this.LoginForm.value.password,


    }
    this.userLogin.Login(data).subscribe(data=>{
      if(data.data[0].role === 'seller'){
        this.router.navigate(['/homeseller'])
      }else{
        this.router.navigate(['/'])
      }
      
    })
  }
}
