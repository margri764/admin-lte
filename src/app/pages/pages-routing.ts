import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';


const routes: Routes = [

  {
    path: '',
    component: PagesComponent,
    children:[
       { path: 'dashboard',  component: DashboardComponent },
       { path: 'progress',  component: ProgressComponent },
       { path: '',  redirectTo: '/dashboard', pathMatch: 'full' },
   ]
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PagesRoutingModule { }
