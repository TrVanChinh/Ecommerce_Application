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
      label: 'Quản lý sản phẩm',
      route: '/product',
      isActive: false 
    },
    {
      icon: 'analytics',
      label: 'Quản lý đơn hàng',
      route: '/Order',
      isActive: false 
    },
    {
      icon: 'comment',
      label: 'Quản lý hồ sơ',
      route: '/profile-seller',
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
