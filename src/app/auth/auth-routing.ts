import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResendPasswordComponent } from './resend-password/resend-password.component';


const routes: Routes = [

  { path: 'login',  component: LoginComponent  },
  { path: 'register',  component: RegisterComponent },
  { path: 'resend-password',  component: ResendPasswordComponent },
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthRoutingModule { }
