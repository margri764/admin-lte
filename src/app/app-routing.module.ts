import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';
import { PagesRoutingModule } from './pages/pages-routing';
import { AuthRoutingModule } from './auth/auth-routing';
import { ValidateEmailComponent } from './shared/validate-email/validate-email.component';

const routes: Routes = [
   { path: 'verificar-email/:code', component:ValidateEmailComponent  },
   { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
   { path: '**', component: NoPageFoundComponent },
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes),
      PagesRoutingModule,
      AuthRoutingModule
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
