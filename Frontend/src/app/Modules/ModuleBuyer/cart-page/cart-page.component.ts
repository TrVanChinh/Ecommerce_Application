import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/Core/Service/cart.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cartData: any;
  userId: string | null = '';
  selectedProducts: any[] = [];
  lenghCartselect: number = 0;
  Total: number = 0;

  displayedColumns: string[] = [
    'select',
    'name',
    'image',
    'price',
    'quantity',
    'total',
    'remove',
  ];
  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.getcart();
  }

  getcart() {
    this.cartService.getCart(this.userId).subscribe((res) => {
      this.cartData = res.data;
      console.log('1', this.cartData);
    });
  }

  toggleSelection(product: any) {
    const index = this.selectedProducts.findIndex((p) => p === product);
    if (index === -1) {
      this.selectedProducts.push(product);
      this.Total += product.option.price * product.quantity;
    } else {
      this.selectedProducts.splice(index, 1);
      this.Total -= product.option.price * product.quantity;
    }

    this.lenghCartselect = this.selectedProducts.length;
  }

  isSelected(product: any): boolean {
    return this.selectedProducts.includes(product);
  }

  deleteCart(id: string) {
    console.log(id);
    const data = {
      cartId: id,
      userId: this.userId,
    };
    this.cartService.deleteCart(data).subscribe((res) => {
      this.getcart();
      console.log(res);
    });
  }
  handleQuantity(action: string, cartID: any) {
    const data = {
      cartId: cartID,
      userId: this.userId,
    };
    if (action === 'plus') {
      this.cartService.increaseQuantity(data).subscribe((res) => {
        this.getcart();
        console.log(res);
      });
    } else if (action === 'min') {
      this.cartService.decrementQuantity(data).subscribe((res) => {
        this.getcart();
        console.log(res);
      });
    }
  }
  checkout() {
    localStorage.setItem('cartData', JSON.stringify(this.selectedProducts));
    this.router.navigate(['/checkout']);
  }
}
