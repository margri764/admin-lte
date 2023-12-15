import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AppState } from '../../redux/app.reducer';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../../models/user.models';
import { environment } from 'src/environments/environment';
import { Observable, map, tap } from 'rxjs';
import * as authActions from 'src/app/shared/redux/auth.actions'
import { LocalstorageService } from '../localstorage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{

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

  ngOnInit(): void {
  }


  getUserLogs( id:any ){
  
    return this.http.get<any>(`${this.baseUrl}api/auth/getUserLogs/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from ipgetUserLogsInfo service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  setUserLogs( body:any ){
  
    return this.http.post<any>(`${this.baseUrl}api/auth/setUserLogs`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from setUserLogs service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  simpleCode( body : any){
  
    return this.http.patch<any>(`${this.baseUrl}api/auth/simpleCode`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from simpleCode service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  login(email: string, password : string){
    
    const body = { email, password }
  
  
    return this.http.post<any>(`${this.baseUrl}api/auth/login`, body) 
    
    .pipe(
      tap( ( {user, token, success, firstlogin}) =>{
                      if(success && firstlogin && firstlogin === "true"){
                          this.token = token;
                          this.cookieService.set('token',token);
                          this.user = user;
                          this.store.dispatch(authActions.setUser({user}));
                          const userToLS = { name: user.Nome_Completo, role:user.role};
                          this.localStorageService.saveStateToLocalStorage(userToLS, 'user');
                      }           
                    
                }  
      ),            
      map( res => {console.log("from login Service: ",res);return res} )
    )
  }

  doubleAuth( body:any ){
  
    return this.http.post<any>(`${this.baseUrl}api/auth/doubleAuth`, body) 
    
    .pipe(
      tap( ( {user, token, success}) =>{
                      if(success){
                          this.token = token;
                          this.cookieService.set('token',token);
                          this.user = user;
                          this.store.dispatch(authActions.setUser({user}));
                          const userToLS = { name: user.Nome_Completo, role:user.role, email: user.Email};
                          this.localStorageService.saveStateToLocalStorage(userToLS, 'user');
                      }           
                    
                }  
      ),            
      map( res => {console.log("from doubleAuth Service: ",res);return res} )
    )
  }

  signUp(body:User){
    
    return this.http.post<any>(`${this.baseUrl}api/auth/signUp`, body) 
    
    .pipe(
      tap( ( res) =>{
                     
                    console.log("from signUp Service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  resendPasword(email: string){
    const body = {email}
  
    return this.http.post<any>(`${this.baseUrl}api/auth/resendPassword`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from resendPasword service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  contactUs(body: string){

    return this.http.post<any>(`${this.baseUrl}api/auth/adminContactUs`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from contactUs service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  validateEmail(body: any){

    return this.http.post<any>(`${this.baseUrl}api/auth/validateEmail`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from validateEmail service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  verifyEmail( email: string){

    const body = { email}

    return this.http.post<any>(`${this.baseUrl}api/auth/verifyEmail`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from verifyEmail service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  activeAccount(email:string, active:string){

    const body = { email }

    return this.http.post<any>(`${this.baseUrl}api/auth/activeAccount?active=${active}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from activeAccount service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getRequestedPermissions(){

    return this.http.get<any>(`${this.baseUrl}api/auth/checkRegistrationPermission`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getRequestedPermissions service: ",res);
                }  
      ),            
      map( res => res )
    )
  }


  

  getToken(){
    return this.token
  }
  
  getCookieToken() {
    return this.cookieService.get('token');
  }
}
