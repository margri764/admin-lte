import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from './shared/redux/app.reducer';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './shared/services/auth/auth.service';
import { ErrorService } from './shared/services/error/error.service';
import { getDataLS, getDataSS } from './shared/storage';
import { LocalstorageService } from './shared/services/localstorage/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isLoading : boolean = false;
  user: any;

  constructor(
                public router : Router,
                private cookieService : CookieService,
                private errorService : ErrorService,
                private localStorageService : LocalstorageService,
                // private authService : AuthService,
                // private store : Store <AppState>,

){

  // ojo con el verificar-email!! xq sino cuando entro me redirecciona al login

// const token = this.cookieService.get('token');
// const userLS = getDataLS('user');
// const logged = getDataLS("logged"); 
// const loggedSS = getDataSS("logged"); 

// if(token !== '' && userLS === undefined){
// this.router.navigateByUrl('/login');
// }

// if(logged === undefined && loggedSS === undefined ){
// this.router.navigateByUrl('/login');
// }


}

ngOnInit(): void {

this.localStorageService.loadInitialState();
this.errorService.closeIsLoading$.subscribe((emmited)=>{if(emmited){this.isLoading = false}})



}
}
