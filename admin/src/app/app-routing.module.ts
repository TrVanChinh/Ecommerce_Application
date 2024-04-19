import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AComponent } from './a/a/a.component';
import { DashboardComponent } from './admin/Pages/dashboard/dashboard.component';
import { UserComponent } from './admin/Pages/user/user.component';
import { CategoryComponent } from './admin/Pages/category/category.component';
import { AdminManagerComponent } from './admin/Pages/admin-manager/admin-manager.component';



const routes: Routes = [

  { path:'dashboard',component:DashboardComponent},
  { path:'user',component:UserComponent},
  { path:'Category',component:CategoryComponent},
  { path:'addAdmin',component:AdminManagerComponent},
  { path:'a',component:AComponent}



];

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
