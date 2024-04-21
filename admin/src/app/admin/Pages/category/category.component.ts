
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CategoryService } from 'src/app/Core/Services/category.service';


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
  btnadd:boolean = true;
  idCategory:string="";
  idparamsCategory:string|null = "";
  showSubCategory:boolean = false;
  idSub:string = "";
  constructor(private categorySevice:CategoryService,private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.idparamsCategory = this.route.snapshot.paramMap.get("id");
    if(this.idparamsCategory){
      this.showSubCategory = true
    }
    this.getCategory();
    this.getSubCategory();
  }

  //get Category
  getCategory() {
    this.categorySevice.getCategory().subscribe(res =>{
      this.DataCategory = res.data;
    });
  }

 
  //get Category by id
  getCategoryById(IDcategory:any){
    this.idCategory=IDcategory._id;
    this.categorySevice.getCategorybyID(IDcategory._id).subscribe(res =>{
      this.categoryName = res.data.name;
      this.btnadd = false;
    })
  }
 
  //update category 
  updateCategory(){
    this.categorySevice.UpdateCategory(this.idCategory,this.categoryName).subscribe(res =>{
      this.getCategory();
      this.categoryName= "";
      this.btnadd = true;
    })
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

  // Get Subcategory
  getSubCategory(){
    if(this.idparamsCategory){
      this.categorySevice.getCategorybyID(this.idparamsCategory).subscribe(res => {
        this.DataSubCategory = res.data.subCategory;
      })
    }
  }
  //add subCategory
  addSubCategory() {
      this.categorySevice.addSubCategory(this.categoryName, this.idparamsCategory).subscribe(res =>{
        this.categoryName = "";
        this.getSubCategory();
      });
  }


  updateSubCategory(){
    this.categorySevice.UpdateSubCategory(this.idparamsCategory,this.idSub,this.categoryName).subscribe(res => {
      this.getSubCategory();
      this.categoryName = "";
      this.btnadd = !this.btnadd;
    }); 
    }

  deleteSubCategory(data:any){
    this.categorySevice.DeleteSubCategory(data._id,this.idparamsCategory).subscribe(res =>{
      this.getSubCategory();
    });
   
    
  }
  getSubCategoryById(data:any){
    this.idSub = data._id;
    this.categoryName = data.name;
    this.btnadd = false;
  }
}
