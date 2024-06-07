import { Component, OnInit } from '@angular/core';
import { UserAccountService } from 'src/app/Core/Service/user-account.service';

@Component({
  selector: 'app-nav-user',
  templateUrl: './nav-user.component.html',
  styleUrls: ['./nav-user.component.css']
})
export class NavUserComponent implements OnInit {
  userId: string | null = "";
  dataprofile: string | null = null; 
  constructor(private userService: UserAccountService) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.getprofileUser();
  }

  getprofileUser() {
    this.userService.profileUser(this.userId).subscribe((res: any) => {
      console.log(res.data);
      this.dataprofile = res.data.avatarUrl;
    });
  }

}
