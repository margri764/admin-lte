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
export class UserService {

  authDelDocument$ : EventEmitter<boolean> = new EventEmitter<boolean>; 



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

    return this.http.get<any>(`${this.baseUrl}api/document/getDocByUserId/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getDocByUserId service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getDocumentById( id:any ){

    return this.http.get<any>(`${this.baseUrl}api/document/getDocumentById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getDocumentById service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  uploadDocument( id:any , file:any){

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}api/document/uploadDocument/${id}`, formData) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from uploadDocument service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteDocById( id:any ){

    return this.http.patch<any>(`${this.baseUrl}api/document/deleteDocById/${id}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteDocById service: ",res);
                }  
      ),            
      map( res => res )
    )
  }




}
