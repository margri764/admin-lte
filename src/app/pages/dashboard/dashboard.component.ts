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
  reqRegister : any;
  reqLength: number = 0;

  constructor(
                public router : Router,
                private errorService : ErrorService,
                private store : Store <AppState>,
                private authService : AuthService,
                private localStorageService : LocalstorageService,
                private cookieService : CookieService,
  ) { }

  ngOnInit(): void {

  this.errorService.closeIsLoading$.subscribe((emmited)=>{if(emmited){this.isLoading = false}});
      this.authService.getRequestedPermissions().subscribe(
        ({success, requests})=>{
          if(success){
            this.reqRegister = requests;
            this.reqLength = requests.length;
          }
        })

    
  
  }

}
