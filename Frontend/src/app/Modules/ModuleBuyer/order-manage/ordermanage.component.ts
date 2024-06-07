import { Component, OnInit } from '@angular/core';
import { get } from 'http';
import { OrderService } from 'src/app/Core/Service/order.service';

@Component({
  selector: 'app-ordermanage',
  templateUrl: './ordermanage.component.html',
  styleUrls: ['./ordermanage.component.css']
})
export class OrdermanageComponent implements OnInit {
  userId:string | null = "";
  dataOrdered:any[] = [];
  cancelOrder:any[] = [];
  CompletedOrder:any[] = [];
  DeliveredOrder:any[] = [];
  DeliveringOrder:any[] = [];
  constructor( private orderService:OrderService) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    this.getOrder()
  }


  getOrder(){
    this.orderService.getOrder(this.userId).subscribe((res:any) => {
      console.log(res)
      this.dataOrdered = res.newOrdered
      this.cancelOrder = res.newCancelOrder
      this.CompletedOrder = res.newCompletedOrder
      this.DeliveredOrder = res.newDeliveredOrder
      this.DeliveringOrder = res.newDeliveringOrder
      console.log("data",this.dataOrdered)
    })
  }
  CancleOrder(idOrder:string){
    this.orderService.cancelOrder(idOrder).subscribe(res=> {
      console.log(res)
      this.getOrder()
    })
  } 

  confirm(idOrder:string){
    this.orderService.confirmOrder(idOrder).subscribe(res=> {
      console.log(res)
      this.getOrder()
    })
  }
}
