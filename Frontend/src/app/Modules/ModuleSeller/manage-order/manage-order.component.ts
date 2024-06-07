import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from 'src/app/Core/Service/order.service';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.css']
})
export class ManageOrderComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  idShop:string | null = '';
  dataOrder:any[] = [];
  dataComplete: any[] = [];
  dataCancel: any[] = [];
  dataProcessing: any[] = [];
  dataPaid: any[] = [];
  delivered: any[] = [];
  

  displayedColumns: string[] = ['id', 'nameproduct', 'nameUser', 'status','action'];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
   this.idShop = localStorage.getItem('userId');
   console.log(this.idShop)
   this.getOrder();
  }


  getOrder(){
    this.orderService.getOrderbyShop(this.idShop).subscribe((res:any) => {
      this.dataOrder = res.orders ;
      this.dataComplete = [];
      this.dataCancel = [];
      this.dataProcessing = [];
      this.dataPaid = [];
      this.delivered = [];
      this.dataOrder.forEach(order => {
        switch (order.status) {
          case 'completed':
            this.dataComplete.push(order);
            break;
          case 'canceled':
            this.dataCancel.push(order);
            break;
          case 'processing':
            this.dataProcessing.push(order);
            break;
          case 'paid':
            this.dataPaid.push(order);
            break;
          case 'delivered':
            this.delivered.push(order);
            break;
        }
      });

    });
  }
  

  changeStatusOrder(orderId:string){
    const status = 'delivered'
    this.orderService.changeStatusOrder(orderId,status).subscribe(res => {
      console.log(res)
      this.getOrder()
    })
  }

}
