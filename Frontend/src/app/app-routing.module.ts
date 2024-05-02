import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Modules/ModuleAccount/login/login.component';
import { SigninComponent } from './Modules/ModuleAccount/signin/signin.component';
import { HomeComponent } from './Modules/ModuleBuyer/home/home.component';
import { AbcComponent } from './abc/abc.component';


const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'signin', component:SigninComponent},
  {path:'category/:categoryId', component:AbcComponent},

  {path:'',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
