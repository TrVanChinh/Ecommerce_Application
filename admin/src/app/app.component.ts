import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminManagerService } from './Core/Services/admin-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  LoginForm!: FormGroup;
  loggedIn: boolean = false;
  opened: boolean = false;
  isExpanded: boolean = false;
  constructor(
    private adminSerive: AdminManagerService,
    private fb: FormBuilder,
    private router:Router
  ) {}
  ngOnInit(): void {
    this.LoginForm = this.fb.group({
      email: '',
      password: '',
    });
    let idadmin = localStorage.getItem('IdAdmin');
    if (idadmin) {
      this.loggedIn = true;
    }
  }

  onSubmit(): void {
    const data = {
      email: this.LoginForm.value.email,
      password: this.LoginForm.value.password,
    };
    this.adminSerive.AdminSignIn(data).subscribe((res) => {
      this.router.navigate(['/dashboard'])
      this.loggedIn = true; 

    });
  }

  handleEvent(event: string) {
    if(event){
      this.loggedIn = false;
      localStorage.removeItem("IdAdmin")
    }
  }
}
