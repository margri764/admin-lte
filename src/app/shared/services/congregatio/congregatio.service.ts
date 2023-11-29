import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { AppState } from '../../redux/app.reducer';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../../models/user.models';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs';
import * as authActions from 'src/app/shared/redux/auth.actions'
import { LocalstorageService } from '../localstorage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class CongregatioService {

  // authDelDocument$ : EventEmitter<boolean> = new EventEmitter<boolean>; 



  token : string = '';
  user! : User;
  private baseUrl = environment.baseUrl;

  constructor(
                private http : HttpClient,
                private store : Store <AppState>,
                private cookieService: CookieService,
                private localStorageService : LocalstorageService,
                private router : Router
  ) { }



  searchUserCongregatio( query:any ){

    return this.http.get<any>(`${this.baseUrl}api/congregatio/searchUserCongregatio?querySearch=${query}`) 
    
    .pipe(
      tap( ( {users}) =>{
                    console.log("from searchUserCongregatio service: ",users);
                }  
      ),            
      map( res => res )
    )
  }




}
