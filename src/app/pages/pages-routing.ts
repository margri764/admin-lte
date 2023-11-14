import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graphic1Component } from './graphic1.component';
import { UsersComponent } from './users/users.component';
import { ClientsComponent } from './clients/clients.component';


const routes: Routes = [

  {
    path: 'dashboard',
    component: PagesComponent,
    children:[
       { path: '',  component: DashboardComponent },
       { path: 'progress',  component: ProgressComponent },
       { path: 'graphics',  component: Graphic1Component },
       { path: 'usuarios',  component: UsersComponent },
       { path: 'clientes',  component: ClientsComponent },
   ]
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PagesRoutingModule { }
