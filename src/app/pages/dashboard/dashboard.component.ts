import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { distinctUntilChanged, filter } from 'rxjs';
import { AppState } from 'src/app/shared/redux/app.reducer';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage/localstorage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user:any;
  isLoading : boolean = false;

  constructor(
                public router : Router,
                private store : Store <AppState>,
                private errorService : ErrorService,
                private localStorageService : LocalstorageService,
                private cookieService : CookieService,
                private authService : AuthService,
  ) { }

  ngOnInit(): void {

  this.errorService.closeIsLoading$.subscribe((emmited)=>{if(emmited){this.isLoading = false}})

    
  this.store.select('auth')
  .pipe(
  filter( ({user})=>  user != null && user != undefined),
  distinctUntilChanged((prev, curr) => prev.user === curr.user)
  ).subscribe(
  ({user})=>{
  this.user = { name:user?.name, lastName: user?.lastName} ;
  this.isLoading = false;
  })
  }

}
