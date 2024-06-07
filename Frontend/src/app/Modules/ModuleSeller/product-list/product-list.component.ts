import {AfterViewInit,OnInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ProductService } from 'src/app/Core/Service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  idShop:string | null = '';
  displayedColumns: string[] = ['name', 'description', 'image', 'price', 'quantity','action'];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
   this.idShop = localStorage.getItem('userId');
   this.getProduct();
  }


  getProduct(){
    this.productService.ListProductShop(this.idShop).subscribe(res => {
      console.log(res);
      this.dataSource = new MatTableDataSource<any>(res.data); 
    });
  }
  DeleteProduct(productid:string){
    console.log(productid)
    this.productService.DeleteProduct(productid).subscribe(res =>{
      console.log(res)
      this.getProduct();
    })
  }

 
}
