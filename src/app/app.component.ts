import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from './shared/redux/app.reducer';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './shared/services/auth/auth.service';
import { ErrorService } from './shared/services/error/error.service';
import { getDataLS, getDataSS } from './shared/storage';
import { LocalstorageService } from './shared/services/localstorage/localstorage.service';
import { delay, filter } from 'rxjs';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isLoading : boolean = false;
  user: any;
  msg : string = '';
  phone : boolean = false; 
  remainingAttemps : number = 0;
  
  show404 : boolean = false;
  show400 : boolean = false;
  show401 : boolean = false;
  show429 : boolean = false;
  showBackDown : boolean = false;

  constructor(
                public router : Router,
                private cookieService : CookieService,
                private errorService : ErrorService,
                private localStorageService : LocalstorageService,
                private store : Store <AppState>,

                private authService : AuthService,

){

  
  (screen.width <= 800) ? this.phone = true : this.phone = false;

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

this.errorService.close$.subscribe((emitted)=>{if(emitted){this.closeToast()} })

this.errorService.closeIsLoading$.pipe(delay(700)).subscribe(emitted => emitted && (this.isLoading = false));

this.errorService.status400Error$.pipe(delay(1200)).subscribe(( {emmited, msg} )=>{if(emmited){this.show400 = true; this.msg = msg; this.show401 = false; this.show429 = false}});

this.errorService.status429Error$.pipe(delay(1200)).subscribe(( {emmited, msg} )=>{if(emmited){this.show429 = true; this.msg = msg, this.show401 = false; this.show400 = false}});

this.errorService.status401Credentials$.pipe(delay(1200)).subscribe(( {emmited, msg, remainingAttempts} )=>{ if(emmited){this.show401 = true; this.msg = msg; this.remainingAttemps = remainingAttempts; this.show400 = false; this.show429 = false}} )

this.errorService.backIsDown$.pipe(delay(1200)).subscribe(( {emmited, msg} )=>{ if(emmited){this.showBackDown = true; this.msg = msg; this.show400 = false; this.show429 = false; this.gotoDashboard() }});


}

closeToast(){
  this.show401 = false;
  this.show404 = false;
  this.show429 = false;
  this.showBackDown = false;
}

gotoDashboard(){
  this.router.navigateByUrl('/dashboard');
}
}
