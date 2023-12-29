import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { Graphic1Component } from './graphic1.component';
import { UsersComponent } from './users/users.component';
// import { PagesRoutingModule } from './pages-routing';
import { RouterModule } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { DataTablesModule } from "angular-datatables";
import { EditClientComponent } from './edit-client/edit-client.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NewUserComponent } from './new-user/new-user.component';
import { NewClientComponent } from './new-client/new-client.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AlarmsComponent } from './alarms/alarms/alarms.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GroupsComponent } from './groups/groups.component';
import { CongregatioComponent } from './congregatio/congregatio/congregatio.component';
import { ViewCongregatiComponent } from './view-congregatio/view-congregati/view-congregati.component';
import { BackgroundComponent } from './background/background.component';
import { ViewGroupComponent } from './modals/view-group/view-group/view-group.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImagenPathPipe } from '../shared/pipes/imagen-path.pipe';
import { ActiveUsersComponent } from './active-users/active-users/active-users.component';
import { DeactiveUsersComponent } from './deactive-users/deactive-users/deactive-users.component';
import { WebMastersComponent } from './web-masters/web-masters/web-masters.component';
import { AdminComponent } from './admin/admin/admin.component';
import { UploadDocumentsComponent } from './upload-documents/upload-documents/upload-documents.component';
import { FileSizePipe } from '../shared/pipes/file-size.pipe';
import { FileTypePipe } from '../shared/pipes/file-img.pipe';
import { ImagenDocPathPipe } from '../shared/pipes/imagen-doc-path.pipe';


@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    PagesComponent,
    Graphic1Component,
    UsersComponent,
    ClientsComponent,
    EditClientComponent,
    EditUserComponent,
    NewUserComponent,
    NewClientComponent,
    AlarmsComponent,
    GroupsComponent,
    CongregatioComponent,
    ViewCongregatiComponent,
    BackgroundComponent,
    ViewGroupComponent,
    ImagenPathPipe,
    FileSizePipe,
    ActiveUsersComponent,
    DeactiveUsersComponent,
    WebMastersComponent,
    AdminComponent,
    UploadDocumentsComponent,
    FileTypePipe,
    ImagenDocPathPipe
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
    ReactiveFormsModule,
    DataTablesModule,
    NgChartsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxDropzoneModule,
    PdfViewerModule,
    NgbModule,

  ]
})
export class PagesModule { }
