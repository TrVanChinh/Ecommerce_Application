import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { ProductService } from 'src/app/Core/Service/product.service';
import { ReportService } from 'src/app/Core/Service/report.service';



@Component({
  selector: 'app-report-inventory',
  templateUrl: './report-inventory.component.html',
  styleUrls: ['./report-inventory.component.css']
})
export class ReportInventoryComponent implements OnInit {
  shopid: string | null = "";
  selectedProduct: string = "";
  products: any[] = [];

  barChartOptions: any = {
    // Chart options
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend: boolean = true;
  barChartData: any[] = [];

  constructor(private reportService: ReportService, private productService: ProductService) { }

  ngOnInit(): void {
    this.shopid = localStorage.getItem('userId');
    this.getProducts();
    this.getInventory();
  }

  getProducts() {
    this.productService.ListProductShop(this.shopid).subscribe((res: any) => {
      this.products = res.data;
    });
  }

  getInventory() {
    // Initially fetch inventory data for the first product
    if (this.products.length > 0) {
      this.selectedProduct = this.products[0]._id; // Select the first product
      this.reportService.getinventory(this.selectedProduct, 2024).subscribe(res => {
        const data = res.result
        console.log("123",data)
        if (res) {
         
          // Extract month values as labels
          this.barChartLabels = data.map((item:any) => item.month.toString());
          
          // Extract data for each metric (stock, totalSoldInMonth, totalImportInMonth)
          const stockData = data.map((item:any) => item.stock);
          const totalSoldInMonthData = data.map((item:any) => item.totalSoldInMonth);
          const totalImportInMonthData = data.map((item:any) => item.totalImportInMonth);
          
          // Set data for each metric as separate datasets
          this.barChartData = [
            { data: stockData, label: 'Stock' },
            { data: totalSoldInMonthData, label: 'Total Sold' },
            { data: totalImportInMonthData, label: 'Total Import' }
          ];
        } else {
          console.error("Invalid data format: Data is not an array.");
        }
      });
    }
  }
  
  

  onProductChange() {
    
    this.getInventory();
  }

}
