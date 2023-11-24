import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { DataTablesModule } from "angular-datatables";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PdfViewerModule } from 'ng2-pdf-viewer';


import { AppComponent } from './app.component';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';


// services

//ngrx
import { StoreModule } from '@ngrx/store';
import { appReducers } from 'src/app/shared/redux/app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';



import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';
import { environment } from 'src/environments/environment';
import { InterceptorService } from './shared/services/interceptor/interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NoPageFoundComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AuthModule,
    DataTablesModule,
    NgxDropzoneModule,
    PdfViewerModule,
    StoreModule.forRoot(appReducers),
    environment.imports,
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
  
      },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
