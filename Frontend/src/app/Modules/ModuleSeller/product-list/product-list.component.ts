import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/Core/Service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  ListProductShop:any;
  constructor(private productService:ProductService) { }

  ngOnInit(): void {
    const idShop = localStorage.getItem('userId')
    
    this.productService.ListProductShop(idShop).subscribe(res =>{
      console.log(res)
    })
  }

}
