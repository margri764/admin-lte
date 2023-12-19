import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth-routing';
import { ResendPasswordComponent } from './resend-password/resend-password.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ResendPasswordComponent,
  ],

  exports: [
    LoginComponent,
    RegisterComponent,
    ResendPasswordComponent,

  ],
  imports: [
    CommonModule,
    // AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class AuthModule { }
