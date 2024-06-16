import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/Core/Service/category.service';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {
  dataCategory:any;
  constructor(private categoryService:CategoryService,private router:Router) { }

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
  showproductbyid(id:string){
    console.log(id);
    this.router.navigate([`/${id}`])
  }
  showproductbyidsub(id:string){
    console.log(id)
    this.router.navigate([`/${id}`])
  }

}
