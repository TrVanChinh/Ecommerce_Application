import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/Core/Service/cart.service';
import { ProductService } from 'src/app/Core/Service/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  idproduct: string | null = '';
  productDetail: any;
  selectedImageUrl: string = '';
  productOption: any;
  productCart: any;
  selectedIndex: number | null = null;
  removeCart: boolean = false;
  productQuantity: number = 1;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idproduct = this.route.snapshot.paramMap.get('idproduct');
      if (this.idproduct) {
        this.productService.getOneProduct(this.idproduct).subscribe((res) => {
          this.productDetail = res.data;
          console.log("product detail",this.productDetail);
          this.productOption = this.productDetail.option[0];
        });
      }

      const userId = localStorage.getItem('userId');
      if (userId) {
        this.cartService.getCart(userId).subscribe((res) => {
          if (res && res.data) {
            res.data.filter((item: any) => {
              if (item.product._id === this.idproduct) {
                this.removeCart = true;
              } else {
                this.removeCart = false;
              }
            });
          }
        });
      }
    });
    
  }
  selectImage(imageUrl: string, i: number) {
    this.selectedIndex = i;
    this.selectedImageUrl = imageUrl;
    this.productOption = this.productDetail.option[i];
    console.log(this.productOption);
  }

  addCart(data: any) {
    const userId = localStorage.getItem('userId');
    const dataCart = {
      optionProductId: this.productOption._id,
      productId: data._id,
      quantity: this.productQuantity,
      userId: userId,
    };
    console.log(dataCart);
    this.cartService.addProductToCart(dataCart);
    this.removeCart = true;
  }
  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }
}
