import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { distinctUntilChanged, filter } from 'rxjs';
import { AppState } from 'src/app/shared/redux/app.reducer';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage/localstorage.service';
import { getDataLS } from 'src/app/shared/storage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user:any;
  isLoading : boolean = false;
  reqRegister : any []=[];
  reqLength: number = 0;

  constructor(
                public router : Router,
                private errorService : ErrorService,
                private authService : AuthService,
                private store : Store <AppState>,
                private localStorageService : LocalstorageService,
                private cookieService : CookieService,
  ) { }

  ngOnInit(): void {

  this.errorService.closeIsLoading$.subscribe((emmited)=>{if(emmited){this.isLoading = false}});
  
   

  //         this.store.dispatch(authActions.setUser({user}));
  // const userToLS = { name: user.Nome_Completo, role:user.role};
  // this.localStorageService.saveStateToLocalStorage(userToLS, 'user');

  this.store.select('auth')
  .pipe(
    filter( ({user})=>  user != null && user != undefined),
  ).subscribe(
    ()=>{
      this.getRequestedPermissions()
      this.isLoading = false;
    })

  this.setUserLogs();
  
  }

  setUserLogs(){
     const user = getDataLS('user');
     console.log(user);
     const body = { email: user.email}
    this.authService.setUserLogs(body).subscribe(
      ( {success} )=>{})
  }

  getRequestedPermissions(){

  this.authService.getRequestedPermissions().subscribe(
    ({success, requests})=>{
      if(success){
        this.reqRegister = requests;
        this.reqLength = requests.length;
      }
    })
  }


}
