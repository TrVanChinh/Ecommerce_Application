import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AComponent } from './a/a/a.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AppCustomSidenavComponent } from './share/layout/app-custom-sidenav/app-custom-sidenav.component';
import { DashboardComponent } from './admin/Pages/dashboard/dashboard.component';
import { UserComponent } from './admin/Pages/user/user.component';
import { CategoryComponent } from './admin/Pages/category/category.component';
import { AdminManagerComponent } from './admin/Pages/admin-manager/admin-manager.component';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [
    AppComponent,
    AppCustomSidenavComponent,
    DashboardComponent,
    UserComponent,
    CategoryComponent,
    AdminManagerComponent,
    AComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTableModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
