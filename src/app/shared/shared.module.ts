import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';



import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { ValidateEmailComponent } from './validate-email/validate-email.component';
import { StoreModule } from '@ngrx/store';



@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    BreadcrumbComponent,
    ValidateEmailComponent,
  ],

  exports: [
    SidebarComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    BreadcrumbComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    StoreModule


  ]
})
export class SharedModule { }
