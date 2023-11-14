import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { Graphic1Component } from './graphic1.component';
import { UsersComponent } from './users/users.component';
import { PagesRoutingModule } from './pages-routing';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    PagesComponent,
    Graphic1Component,
    UsersComponent
  ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    PagesComponent,
    Graphic1Component,
    UsersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    NgChartsModule.forRoot(),
  ]
})
export class PagesModule { }
