import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/Core/Service/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataCategory:any;
  dataSubCategory:any;
  constructor(private categoryService:CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategory().subscribe(res =>{
      this.dataCategory = res.data;
    })
    
  }

  activeCategory: any = null;
  openMenu(category: any) {
    this.activeCategory = category;
  }

  closeMenu() {
    this.activeCategory = null;
  }

}
