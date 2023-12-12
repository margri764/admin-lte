import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graphic1Component } from './graphic1.component';
import { UsersComponent } from './users/users.component';
import { ClientsComponent } from './clients/clients.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NewUserComponent } from './new-user/new-user.component';
import { NewClientComponent } from './new-client/new-client.component';
import { AlarmsComponent } from './alarms/alarms/alarms.component';
import { GroupsComponent } from './groups/groups.component';
import { CongregatioComponent } from './congregatio/congregatio/congregatio.component';
import { ViewCongregatiComponent } from './view-congregatio/view-congregati/view-congregati.component';


const routes: Routes = [

  {
    path: 'dashboard',
    component: PagesComponent,
    children:[
              { path: '',  component: DashboardComponent, data:{ title:"Dashboard"}},
              { path: 'progress',  component: ProgressComponent , data:{ title:"Progress"}},
              { path: 'graphics',  component: Graphic1Component , data:{ title:"Graficas"}},
              { path: 'usuarios',  component: UsersComponent , data:{ title:"Usuários"}},
              { path: 'clientes',  component: ClientsComponent , data:{ title:"Clientes"}},
              { path: 'editar-clientes/:id',  component: EditClientComponent , data:{ title:"Editar Clientes"}},
              { path: 'ver-congregatio/:id',  component: ViewCongregatiComponent, data:{ title:"Ver Usúario "}},
              { path: 'editar-usuario/:id',  component: EditUserComponent , data:{ title:"Editar Usuário"}},
              { path: 'novo-usuario',  component: NewUserComponent , data:{ title:"Novo Usuário"}},
              { path: 'novo-cliente',  component: NewClientComponent , data:{ title:"Novo Cliente"}},
              { path: 'alarmes',  component: AlarmsComponent , data:{ title:"Alarmes"}},
              { path: 'grupos',  component: GroupsComponent , data:{ title:"Grupos"}},
              { path: 'congregatio',  component: CongregatioComponent , data:{ title:"Congregatio"}},
            ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PagesRoutingModule { }
