import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Route, Router } from '@angular/router';
import { UserAccountService } from './Core/Service/user-account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{

  hideHeaderFooter: boolean = false;

  constructor(private authService:UserAccountService, private router:Router) {}

  ngOnInit() {
    if(localStorage.getItem('role') === 'seller'){
      this.hideHeaderFooter = true
    }

    this.authService.seller.subscribe(res => {
      if(res){
        this.hideHeaderFooter = true
      }
    })
  }

  handleEvent(event: string) {
    if(event){
      this.hideHeaderFooter = false;
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("nameUser");
      // this.router.navigate(["/login"])
    }
  }
 
  
}
