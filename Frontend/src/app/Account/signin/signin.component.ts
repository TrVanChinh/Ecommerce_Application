import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserAccountService } from 'src/app/Service/user-account.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signInForm! : FormGroup;
  userid!: string;
  constructor(private userLogin:UserAccountService, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      username: '',
      password: '',
      email: '',
      dateOfBirth:'',
    });
  }

  onSubmit(): void {
    const data = {
      name: this.signInForm.value.username,
      email:this.signInForm.value.email,
      password:this.signInForm.value.password,
      dateOfBirth:this.signInForm.value.dateOfBirth

    }
    this.userLogin.signUp(data).subscribe(data=>{
      this.userid = data.data.userId;
      console.log('User ID:', this.userid);
    })
  }

}
