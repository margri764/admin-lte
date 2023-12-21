import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';
import { PagesRoutingModule } from './pages/pages-routing';
import { AuthRoutingModule } from './auth/auth-routing';
import { ValidateEmailComponent } from './shared/validate-email/validate-email.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [

  // { path: 'dashboard', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), data: { preload: true } },
  { path: 'verificar-email/:code', component: ValidateEmailComponent  },
  // { path: 'login',  component: LoginComponent  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: NoPageFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    PagesRoutingModule,
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
