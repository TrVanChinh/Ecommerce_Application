import { Component, OnInit } from '@angular/core';
import { race } from 'rxjs';
import { SellerService } from 'src/app/Core/Services/seller.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  ListSellerPending:any;
  constructor(private sellerService:SellerService) { }

  ngOnInit(): void {
  this.sellerService.getSellerPending().subscribe(res => {
    this.ListSellerPending = res;
    console.log(this.ListSellerPending)
  })
  }

}
