import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAccountService } from 'src/app/Core/Service/user-account.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  panelColor = new FormControl('en');
  searchValue: string = '';
  nameUser : string|null = "";
  userId!: string|null;
  menuType: string = 'default';

  
  constructor(private authService:UserAccountService, 
              private router:Router,
              private translate: TranslateService, ) { 
                translate.setDefaultLang('en'); // Ngôn ngữ mặc định
                translate.use('en'); // Sử dụng ngôn ngữ đã chọn
              }


  ngOnInit(): void {
    this.panelColor.setValue('en');
    const storedUser = localStorage.getItem('userId')
    if(storedUser){
      this.nameUser = localStorage.getItem("nameUser")
      this.menuType = 'user'
    }

    this.authService.loggedIn.subscribe(res => {
      if(res){
        this.nameUser = localStorage.getItem("nameUser")
        this.menuType = 'user'
      }
    })
  }

  switchLanguage(event: any) {
    const selectedLanguage = event.value;
    if(selectedLanguage) {
      this.translate.use(selectedLanguage);
    }
  }
  


  clearSearch() {
    this.searchValue = '';
  }
  logout(){
      this.menuType = 'default'
      this.authService.logout();
  }

  sellerAccount(){
    const roleUser = localStorage.getItem('role');
    console.log(roleUser)
     if(roleUser === 'seller'){
        this.router.navigate(['/homeseller'])
     }else{
      this.router.navigate(['/sellerRegister'])

     }
  }
 
}
