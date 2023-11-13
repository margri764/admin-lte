import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';



@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    BreadcrumbComponent,
  ],

  exports: [
    SidebarComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    BreadcrumbComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
