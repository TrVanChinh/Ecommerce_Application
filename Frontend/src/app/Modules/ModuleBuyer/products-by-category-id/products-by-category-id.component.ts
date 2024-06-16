import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/Core/Service/cart.service';
import { CategoryService } from 'src/app/Core/Service/category.service';
import { ProductService } from 'src/app/Core/Service/product.service';

interface FoodNode {
  name: string;
  id: string;
  children?: FoodNode[];
  active: boolean;
}

@Component({
  selector: 'app-products-by-category-id',
  templateUrl: './products-by-category-id.component.html',
  styleUrls: ['./products-by-category-id.component.css'],
})
export class ProductsByCategoryIdComponent implements OnInit {
  dataCategory: any;
  dataSubCategory: any;
  dataProduct: any;
  dataproductbyid: any;
  idCategory: string | null = '';
  showproduct: boolean = true;
  active!:boolean;
  nameProduct:String = "";
  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  toppings = new FormControl('Position');
  selectedNumber = new FormControl('6');

  previousValue:string = '';
  numberSelect:number = 0;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router:Router,
  ) {}

  hasChild = (_: number, node: FoodNode) =>
    !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.previousValue = 'Position';
    this.numberSelect = 6;
    console.log(this.numberSelect)
    this.route.paramMap.subscribe(params => {
      this.idCategory = this.route.snapshot.paramMap.get('product');
      
      this.productService.getProductbyidCategory(this.idCategory).subscribe(res => {
        this.dataproductbyid = res.data
        if(this.dataproductbyid.length === 0){
          this.ProductbySubCategory(this.idCategory)
        }
      })
    });

    this.categoryService.getCategory().subscribe((res) => {
      this.dataCategory = res.data;
      this.dataSource.data = res.data.map((item: any) => {
        this.active = this.idCategory === item._id;
        
        return {
          name: item.name,
          id: item._id,
          children: item.subCategory.map((subItem: any) => {
            const idsub = this.idCategory == subItem._id;
            return {
              name: subItem.name,
              id: subItem._id,
              active: idsub, 
            };
          }),
          active: this.active, 
        };
      });
    });

    this.getProduct();
  }
  getProduct() {
    this.productService.getProduct().subscribe((res) => {
      this.dataProduct = res.data;
      this.dataproductbyid = this.dataProduct.filter((item: any) => {
        return item.idCategory === this.idCategory;
      });
    });
  }

  select(event:any){
    const newValue = event.target.value;
    if (newValue !== this.previousValue) {
        console.log(newValue);
        this.previousValue = newValue; 
    } 
  }

  sortProducts(selectedValue: any): void {
    console.log(selectedValue.target.value)
    switch (selectedValue.target.value) {
      case "AtoZ":
        this.dataproductbyid.sort((a:any, b:any) => a.name.localeCompare(b.name));
        break;
      case "ZtoA":
        this.dataproductbyid.sort((a:any, b:any)=> b.name.localeCompare(a.name));
        break;
      case "LowtoHigh":
        this.dataproductbyid.sort((a:any, b:any)=> a.option[0].price - b.option[0].price);
        break;
      case "HightoLow":
        this.dataproductbyid.sort((a:any, b:any)=> b.option[0].price - a.option[0].price);
        break;
      default:
        // Nếu giá trị không hợp lệ hoặc không có sự thay đổi trong sắp xếp, không làm gì cả
        break;
    }
  }
  
  ProductbyCategory(idCategory: string , name:string) {
    const filteredProducts = this.dataProduct.filter((item: any) => {
      return item.idCategory === idCategory;
    });
   
  this.dataSource.data.forEach((item: any) => {
    item.active = item.id === idCategory;
  });

  // Cập nhật dataSource
  this.dataSource.data = [...this.dataSource.data];

    if (filteredProducts.length > 0) {
      this.dataproductbyid = filteredProducts;
    } else {
      this.getProduct();
      alert('Không có sản phẩm nào thuộc danh mục này');
    }
    this.nameProduct = name;
  }

  ProductbySubCategory(idSubCategory: string| null) {
    const filteredProducts = this.dataProduct.filter((item: any) => {
      return item.idSubCategory === idSubCategory;
    });
  this.dataSource.data.forEach((item: any) => {
       item.children.forEach((item:any)=>{
         item.active =  item.id === idSubCategory
       })
  });

  this.dataSource.data = [...this.dataSource.data];
    if (filteredProducts.length > 0) {
      this.dataproductbyid = filteredProducts;
    } else {
      this.getProduct();
      alert('Không có sản phẩm nào thuộc danh mục này');
    }

  }

  productdetail(id:string){
    this.router.navigate([`/details/${id}`])
  }

  addCart(data:any){
    this.router.navigate([`/details/${data._id}`])
  }

 

  selectNumber(event:any){
    const newValue = event.target.value;
    if (newValue !== this.numberSelect) {
        console.log(newValue);

        this.numberSelect = newValue; 
    } 
  }
}
