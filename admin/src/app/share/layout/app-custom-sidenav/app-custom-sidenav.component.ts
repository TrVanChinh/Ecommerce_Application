import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'src/app/Core/model/menu-item';

@Component({
  selector: 'app-app-custom-sidenav',
  templateUrl: './app-custom-sidenav.component.html',
  styleUrls: ['./app-custom-sidenav.component.css']
})
export class AppCustomSidenavComponent implements OnInit {
  menuItem: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      isActive: false 
    },
    {
      icon: 'supervised_user_circle',
      label: 'Seller',
      route: '/user',
      isActive: false 
    },
    {
      icon: 'analytics',
      label: 'Category',
      route: '/Category',
      isActive: false 
    },
    {
      icon: 'comment',
      label: 'Admin',
      route: '/addAdmin',
      isActive: false 
    }
    ,
    {
      icon: 'logout',
      label: 'Logout',
      route: '/',
      isActive: false 
    }
  ];

  constructor() {}
  @Output() myEvent = new EventEmitter<string>();
  ngOnInit(): void {}

  onItemClick(item: MenuItem): void {
    this.menuItem.forEach(menu => menu.isActive = false);
    item.isActive = true;
    console.log(item.label)
    if(item.label === "Logout"){
        this.myEvent.emit("Logout");
    }
  }

  
}
