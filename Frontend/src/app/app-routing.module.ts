import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Modules/ModuleAccount/login/login.component';
import { SigninComponent } from './Modules/ModuleAccount/signin/signin.component';
import { HomeComponent } from './Modules/ModuleBuyer/home/home.component';
import { AbcComponent } from './abc/abc.component';
import { SellerRegisterComponent } from './Modules/ModuleSeller/seller-register/seller-register.component';
import { HomeSellerComponent } from './Modules/ModuleSeller/home-seller/home-seller.component';
import { ProductComponent } from './Modules/ModuleSeller/product/product.component';
import { SellerGuard } from './Core/Guards/seller.guard';
import { ProductListComponent } from './Modules/ModuleSeller/product-list/product-list.component';


const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'signin', component:SigninComponent},
  {path:'sellerRegister', component:SellerRegisterComponent},
  {path:'category/:categoryId', component:AbcComponent},

  {path:'',component:HomeComponent},


  {path:'homeseller',component:HomeSellerComponent},
  {path:'product',component:ProductListComponent , canActivate:[SellerGuard]},
  {path:'product/create',component:ProductComponent , canActivate:[SellerGuard]}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
