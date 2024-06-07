import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { UserAccountService } from 'src/app/Core/Service/user-account.service';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from 'src/app/Core/Service/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  panelColor = new FormControl('en');
  searchValue: string = '';
  nameUser: string | null = '';
  userId: string | null = '';
  menuType: string = 'default';
  cartlength: number = 0;
  message: string = '';
  SubTotal: number = 0;
  cartLengthSubscription!: Subscription;

  showCartItems: boolean = false;
  dataCart: any;
  constructor(
    private authService: UserAccountService,
    private router: Router,
    private translate: TranslateService,
    private cartService: CartService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.authService.userId.subscribe((userId) => {
      if (userId) {
        this.userId = userId;

        this.nameUser = localStorage.getItem('nameUser');
        this.menuType = 'user';
        this.getLengthCart();
      } else {
        this.menuType = 'default';
      }
    });

    this.panelColor.setValue('en');

    if (this.userId) {
      this.nameUser = localStorage.getItem('nameUser');
      this.menuType = 'user';
      this.getLengthCart();
    } else {
      this.menuType = 'default';
    }
  }
  getLengthCart() {
    this.cartLengthSubscription = this.cartService.cartLength$
      .pipe(
        switchMap((length) => {
          this.cartlength = length;
          return this.cartService.getCart(this.userId);
        })
      )
      .subscribe((res) => {
        if (res && res.data) {
          this.cartlength = res.data.length;
          this.dataCart = res.data;
        } else {
          this.message = 'Không có dữ liệu giỏ hàng ';
        }
      });
  }

  getcart() {
    if (this.userId) {
      this.cartService.getCart(this.userId).subscribe((res) => {
        if (res && res.data) {
          this.cartlength = res.data.length;
          this.dataCart = res.data;
          console.log('data:', this.dataCart);
        } else {
          this.cartlength = 0;
          this.dataCart = [];
          this.message = 'Không có dữ liệu giỏ hàng.';
        }
      });
    }
  }

  RemoveCart(cartId: string) {
    const data = {
      cartId: cartId,
      userId: this.userId,
    };
    this.cartService.deleteCart(data).subscribe((res) => {
      this.getcart();
    });
  }

  ngOnDestroy(): void {
    if (this.userId) {
      this.cartLengthSubscription.unsubscribe();
    }
  }

  showCart() {
    this.showCartItems = true;
  }

  hideCart() {
    this.showCartItems = false;
  }

  switchLanguage(event: any) {
    const selectedLanguage = event.value;
    if (selectedLanguage) {
      this.translate.use(selectedLanguage);
    }
  }

  clearSearch() {
    this.searchValue = '';
  }
  logout() {
    this.cartlength = 0;
    this.menuType = 'default';
    this.authService.logout();
  }

  sellerAccount() {
    const roleUser = localStorage.getItem('role');
    if (roleUser === 'seller') {
      this.router.navigate(['/homeseller']);
    } else {
      this.router.navigate(['/sellerRegister']);
    }
  }

  cartPage(data: any) {
    console.log(data);
    this.router.navigate(['/cart']);
  }
}
