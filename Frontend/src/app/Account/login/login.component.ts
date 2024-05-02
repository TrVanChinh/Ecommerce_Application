import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserAccountService } from 'src/app/Service/user-account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm! : FormGroup;
  constructor(private userLogin:UserAccountService, private fb:FormBuilder) { }

  ngOnInit(): void {
     this.LoginForm = this.fb.group({
      email:'',
      password: '',
    });
  }
  
  onSubmit(): void {
    const data = {
      email:this.LoginForm.value.email,
      password:this.LoginForm.value.password,


    }
    this.userLogin.Login(data).subscribe(data=>{
        console.log(data)
    })
  }
}
