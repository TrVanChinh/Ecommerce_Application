import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Modules/ModuleAccount/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule} from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SigninComponent } from './Modules/ModuleAccount/signin/signin.component';
import { HeaderComponent } from './Shared/header/header.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { HomeComponent } from './Modules/ModuleBuyer/home-buyer/home.component';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import { SellerRegisterComponent } from './Modules/ModuleSeller/seller-register/seller-register.component';
import { HomeSellerComponent } from './Modules/ModuleSeller/home-seller/home-seller.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AppcustomsidenavComponent } from './Shared/appcustomsidenav/appcustomsidenav.component';
import { ProductComponent } from './Modules/ModuleSeller/product/product.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ProductListComponent } from './Modules/ModuleSeller/product-list/product-list.component';
import {MatTableModule} from '@angular/material/table';
import { SwiperModule } from "swiper/angular";
import { ProductDetailComponent } from './Modules/ModuleBuyer/product-detail/product-detail.component';
import { CheckoutComponent } from './Modules/ModuleBuyer/checkout/checkout.component';
import { MyOrderComponent } from './Modules/ModuleBuyer/my-order/my-order.component';
import {MatCardModule} from '@angular/material/card';
import {MatTreeModule} from '@angular/material/tree';
import { TestComponent } from './test/test.component';
import { NoEncodeUriPipe } from './Shared/Pipe/no-encode-uri.pipe';
import { ProductsByCategoryIdComponent } from './Modules/ModuleBuyer/products-by-category-id/products-by-category-id.component';
import {MatBadgeModule} from '@angular/material/badge';
import { ListCategoryComponent } from './Shared/list-category/list-category.component';
import { CartPageComponent } from './Modules/ModuleBuyer/cart-page/cart-page.component';
import { ToastrModule } from 'ngx-toastr';
import { ProfileComponent } from './Modules/ModuleBuyer/profile/profile.component';

import {MatTabsModule} from '@angular/material/tabs';
import { NavUserComponent } from './Shared/nav-user/nav-user.component';
import { DialogAddressComponent } from './Modules/ModuleBuyer/dialog-address/dialog-address.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AddressDialogSelectComponent } from './Modules/ModuleBuyer/address-dialog-select/address-dialog-select.component';
import { OrderDetailComponent } from './Modules/ModuleSeller/order-detail/order-detail.component';
import { ManageOrderComponent } from './Modules/ModuleSeller/manage-order/manage-order.component';
import { OrdermanageComponent } from './Modules/ModuleBuyer/order-manage/ordermanage.component';
import { ChartsModule } from 'ng2-charts';
import { DashboardComponent } from './Modules/ModuleSeller/dashboard/dashboard.component';
import { ReportYearComponent } from './Modules/ModuleSeller/report-year/report-year.component';
import { ReportInventoryComponent } from './Modules/ModuleSeller/report-inventory/report-inventory.component';

import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StatisticalBuyerComponent } from './Modules/ModuleBuyer/statistical-buyer/statistical-buyer.component';
import { ProfileSellerComponent } from './Modules/ModuleSeller/profile-seller/profile-seller.component';
import { RevenueByCustomerComponent } from './Modules/ModuleSeller/revenue-by-customer/revenue-by-customer.component';
import { ResetComponent } from './Modules/ModuleAccount/reset/reset.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SigninComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SellerRegisterComponent,
    HomeSellerComponent,
    AppcustomsidenavComponent,
    ProductComponent,
    ProductListComponent,
    ProductDetailComponent,
    CheckoutComponent,
    MyOrderComponent,
    TestComponent,
    NoEncodeUriPipe,
    ProductsByCategoryIdComponent,
    ListCategoryComponent,
    CartPageComponent,
    ProfileComponent,
    NavUserComponent,
    DialogAddressComponent,
    AddressDialogSelectComponent,
    ManageOrderComponent,
    OrderDetailComponent,
    OrdermanageComponent,
    DashboardComponent,
    ReportYearComponent,
    ReportInventoryComponent,
    ResetComponent,
    StatisticalBuyerComponent,
    ProfileSellerComponent,
    RevenueByCustomerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatListModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatExpansionModule,
    MatToolbarModule,
    MatSidenavModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatTableModule ,
    SwiperModule,
    MatCardModule,
    MatTreeModule,
    MatBadgeModule,
    ToastrModule.forRoot(),
    MatTabsModule,
    MatDialogModule,
    ChartsModule,
    MatDatepickerModule,
    MatNativeDateModule
    
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
