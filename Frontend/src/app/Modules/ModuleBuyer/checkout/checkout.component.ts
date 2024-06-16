import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddressService } from 'src/app/Core/Service/address.service';
import { AddressDialogSelectComponent } from '../address-dialog-select/address-dialog-select.component';
import { MatSelectChange } from '@angular/material/select';
import { OrderService } from 'src/app/Core/Service/order.service';
import { Subject, catchError, forkJoin, takeUntil, tap, throwError } from 'rxjs';
import { CartService } from 'src/app/Core/Service/cart.service';
import { ShippingUnitService } from 'src/app/Core/Service/shipping-unit.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  cartData: any;
  dataAddress: any;
  addresses: any[] = [];
  dataShiper: any[] = [];
  userId: string | null = '';
  nameShippingUnit: string = "";
  shippingCost: string = "";
  idShippingUnit: string = "";
  ToalShippingUnit: number = 0;


  displayedColumns: string[] = ['Product', 'price', 'quantity', 'total', 'shippingunit'];
  selectedPaymentMethod!: string;
  shipperControl = new FormControl();

  constructor(
    private addressService: AddressService, 
    public dialog: MatDialog, 
    private orderservice: OrderService,
    private cartservice: CartService,
    private ShiperService: ShippingUnitService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.addressService.getAddess(this.userId).subscribe((res: any) => {
      this.dataAddress = res.data[0];
      this.addresses = res.data;
    });

    this.ShiperService.getshippingUnit().subscribe(res => {
      this.dataShiper = res.data;
      console.log(this.dataShiper);
    });

    const cartDataString = localStorage.getItem('cartData');
    if (cartDataString) {
      this.cartData = JSON.parse(cartDataString);
      console.log(this.cartData);
    } else {
      console.log('Không có dữ liệu giỏ hàng trong localStorage.');
    }
  }

  getTotalPrice(): number {
    return this.cartData.reduce((total: number, item: any) => {
      return total + (item.option.price * item.quantity);
    }, 0);
  }

  onSelectionChange(event: MatSelectChange) {
    this.selectedPaymentMethod = event.value;
    console.log('Selected payment method:', this.selectedPaymentMethod);
  }

  onSelectionChangeShiper(event: MatSelectChange) {

    this.nameShippingUnit = event.value.name;
    this.shippingCost = event.value.price;
    this.idShippingUnit = event.value._id;
    this.ToalShippingUnit = event.value.price

  }

  openAddressDialog(): void {
    const dialogRef = this.dialog.open(AddressDialogSelectComponent, {
      width: '500px',
      data: this.addresses, 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataAddress = result;
      }
    });
  }

  order() {
    if (this.selectedPaymentMethod === 'online') {
      this.orderservice.payment(this.getTotalPrice() + this.ToalShippingUnit).subscribe(res => {
        console.log(res)
        this.processOrder();
        setTimeout(() => {
          window.location.href = res.payUrl;
        }, 1000);
      });
    } else {
      this.processOrder();
      setTimeout(() => {
        this.router.navigate(['/cartUser'])
      }, 1000);
    }
  }

  private processOrder() {
    const groupedOrders = this.groupByShop(this.cartData);

    const orderRequests = Object.keys(groupedOrders).map(shopId => {
      const order = groupedOrders[shopId];
      const orderOptions = order.map(item => ({
        name: item.option.name,
        idOption: item.option._id,
        idProduct: item.product._id,
        price: item.option.price,
        quantity: item.quantity,
      }));

      const data = {
        idShop: shopId,
        idUser: this.userId,
        option: orderOptions,
        address: this.dataAddress,
        status: this.selectedPaymentMethod === 'cod' ? 'processing' : 'paid',
        nameShippingUnit: this.nameShippingUnit,
        shippingCost: this.shippingCost,
        idShippingUnit: this.idShippingUnit,
      };

      return this.orderservice.addOrder(data).pipe(
        catchError(error => {
          console.error('Error occurred while placing order:', error);
          return throwError(error);
        })
      );
    });

    return forkJoin(orderRequests).pipe(
      tap(() => {
        this.cartservice.deleteCartSequentially(this.cartData).subscribe(
          () => {
            this.cartservice.updateCartLength();
            console.log('All carts deleted successfully.');
          },
          (error: any) => {
            console.error('Error occurred while deleting carts:', error);
          }
        );
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(
      () => {
        console.log('All orders placed successfully.');
      },
      error => {
        console.error('Error occurred while processing orders:', error);
      }
    );
  }

  private groupByShop(cartData: any[]): { [key: string]: any[] } {
    return cartData.reduce((result, item) => {
      const shopId = item.product.idShop;
      result[shopId] = result[shopId] || [];
      result[shopId].push(item);
      return result;
    }, {});
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
