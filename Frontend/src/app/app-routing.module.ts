import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Modules/ModuleAccount/login/login.component';
import { SigninComponent } from './Modules/ModuleAccount/signin/signin.component';
import { SellerRegisterComponent } from './Modules/ModuleSeller/seller-register/seller-register.component';
import { HomeSellerComponent } from './Modules/ModuleSeller/home-seller/home-seller.component';
import { ProductComponent } from './Modules/ModuleSeller/product/product.component';
import { SellerGuard } from './Core/Guards/seller.guard';
import { ProductListComponent } from './Modules/ModuleSeller/product-list/product-list.component';
import { HomeComponent } from './Modules/ModuleBuyer/home-buyer/home.component';
import { ProductsByCategoryIdComponent } from './Modules/ModuleBuyer/products-by-category-id/products-by-category-id.component';
import { ProductDetailComponent } from './Modules/ModuleBuyer/product-detail/product-detail.component';
import { CartPageComponent } from './Modules/ModuleBuyer/cart-page/cart-page.component';
import { CheckoutComponent } from './Modules/ModuleBuyer/checkout/checkout.component';
import { ProfileComponent } from './Modules/ModuleBuyer/profile/profile.component';
import { ManageOrderComponent } from './Modules/ModuleSeller/manage-order/manage-order.component';
import { OrderDetailComponent } from './Modules/ModuleSeller/order-detail/order-detail.component';
import { OrdermanageComponent } from './Modules/ModuleBuyer/order-manage/ordermanage.component';
import { DashboardComponent } from './Modules/ModuleSeller/dashboard/dashboard.component';
import { StatisticalBuyerComponent } from './Modules/ModuleBuyer/statistical-buyer/statistical-buyer.component';

import { ProfileSellerComponent } from './Modules/ModuleSeller/profile-seller/profile-seller.component';
import { ResetComponent } from './Modules/ModuleAccount/reset/reset.component';


const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'signin', component:SigninComponent},
  {path:'reset', component:ResetComponent},

 
  {path:'cartUser',component:CartPageComponent},
  {path:'checkout',component:CheckoutComponent},
  {path:'profile',component:ProfileComponent},
  {path:'ordermanage',component:OrdermanageComponent},
  {path:'statistical',component:StatisticalBuyerComponent},



  {path:'sellerRegister', component:SellerRegisterComponent},
  {path:'homeseller',component:DashboardComponent, canActivate:[SellerGuard]},
  {path:'product',component:ProductListComponent , canActivate:[SellerGuard]},
  {path:'product/create',component:ProductComponent , canActivate:[SellerGuard]},
  {path:'Order',component:ManageOrderComponent},
  {path:'profile-seller',component:ProfileSellerComponent},
  {path:'Order/:idorder',component:OrderDetailComponent},
  {path:'dashboard',component:DashboardComponent},




  {path:'',component:HomeComponent},
 
  {path:':product',component:ProductsByCategoryIdComponent},
  {path:'details/:idproduct',component:ProductDetailComponent}


  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
