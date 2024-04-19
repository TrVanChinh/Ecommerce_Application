import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/Core/Services/category.service';
import { Category } from 'src/app/Core/model/Category';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  DataCategory!:any;
  DataSubCategory:any;
  inputValue = new FormControl('');
  categoryName: string = '';
  constructor(private categorySevice:CategoryService) { }
  ngOnInit(): void {
    this.getCategory();
  }
  //get Category
  getCategory(){
    this.categorySevice.getCategory().subscribe(res=>{
      this.DataCategory = res.data;
    })
  }
  //Edit Category
  editCategory(IDcategpry:string){
    console.log(IDcategpry)
  }
  //Delete Category
  deleteCategory(data:any){
    this.categorySevice.DeleteCategory(data._id).subscribe(() =>{
      this.getCategory();
    })
  }
  //Add Category
  addCategory(){
    this.categorySevice.addCategory(this.categoryName).subscribe(res =>{
      this.categoryName = "";
      this.getCategory();
    })
  }
}
