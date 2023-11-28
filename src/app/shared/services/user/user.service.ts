import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
export class UserService {


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


  getUserById( id:string ){

    return this.http.get<any>(`${this.baseUrl}api/user/getUserById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getUserById service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getDocByUserId( id:string ){

    return this.http.get<any>(`${this.baseUrl}api/document/getDocumentByUserId/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getDocByUserId service: ",res);
                }  
      ),            
      map( res => res )
    )
  }




}