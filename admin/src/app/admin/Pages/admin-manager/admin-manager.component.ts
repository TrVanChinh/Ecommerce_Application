import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminManagerService } from 'src/app/Core/Services/admin-manager.service';
@Component({
  selector: 'app-admin-manager',
  templateUrl: './admin-manager.component.html',
  styleUrls: ['./admin-manager.component.css']
})
export class AdminManagerComponent implements OnInit {
  addAdminForm! : FormGroup;
  constructor(private adminservice:AdminManagerService,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.addAdminForm = this.fb.group({
      name:'',
      email:'',
      password: '',
    });
  }
  onSubmit(): void {
    const data = {
      name:this.addAdminForm.value.name,
      email:this.addAdminForm.value.email,
      password:this.addAdminForm.value.password,


    }
    this.adminservice.addAdmin(data).subscribe(data=>{
        console.log(data)
    })
  }
}
