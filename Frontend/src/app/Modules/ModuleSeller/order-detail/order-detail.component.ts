import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/Core/Service/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  orderId: string | null = '';
  orderData: any[] = [];
  constructor(
    private orderService:OrderService, 
    private route:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('idorder');
      console.log(this.orderId)
      this.getOrderDetail();
    });
  }
  
  getOrderDetail(): void {
    this.orderService.getOrderById(this.orderId).subscribe(res => {
      console.log(res)
      this.orderData = [res.orderDetail]; 
      console.log(this.orderData)
    });
  }

  changeStatusOrder(){
    const status = 'delivered'
    this.orderService.changeStatusOrder(this.orderId,status).subscribe(res => {
      console.log(res)
      this.router.navigate(['/Order'])
    })
  }

}
