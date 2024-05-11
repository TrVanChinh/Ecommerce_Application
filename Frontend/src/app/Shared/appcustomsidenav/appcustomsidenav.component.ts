import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-appcustomsidenav',
  templateUrl: './appcustomsidenav.component.html',
  styleUrls: ['./appcustomsidenav.component.css']
})
export class AppcustomsidenavComponent implements OnInit {
  menuItem: any[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      isActive: false 
    },
    {
      icon: 'Product',
      label: 'product',
      route: '/product',
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

  constructor() { }
  @Output() myEvent = new EventEmitter<string>();
  ngOnInit(): void {}

  onItemClick(item: any): void {
    this.menuItem.forEach(menu => menu.isActive = false);
    item.isActive = true;
    console.log(item.label)
    if(item.label === "Logout"){
        this.myEvent.emit("Logout");
    }
  }

}
