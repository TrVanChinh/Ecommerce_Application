import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { CategoryService } from 'src/app/Core/Service/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  panelColor = new FormControl('Việt Nam');
  searchValue: string = '';
  dataCategory:any;
  dataSubCategory:any;
  nameUser : string|null = "";
  userId!: string|null;
  constructor(private CategoryService:CategoryService) { }

  ngOnInit(): void {
      this.CategoryService.getCategory().subscribe(res =>{
        this.dataCategory = res.data;
      })
      this.userId = localStorage.getItem('userId');
      this.nameUser = localStorage.getItem('nameUser');
      if(this.userId && this.nameUser){
        console.log(this.userId)
        console.log(this.nameUser)
      }
  }


  clearSearch() {
    this.searchValue = '';
  }

  activeCategory: any = null;
  openMenu(category: any) {
    this.activeCategory = category;
  }

  closeMenu() {
    this.activeCategory = null;
  }
}
