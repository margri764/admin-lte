import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppState } from '../../redux/app.reducer';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import * as authActions from 'src/app/shared/redux/auth.actions'

interface response  {
  emmited: boolean,
  msg: string
}

interface response401Credentials  {
  emmited: boolean,
  msg: string,
  remainingAttempts: number
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private baseUrl = environment.baseUrl;
  phone : boolean = false;
  
  close$ = new BehaviorSubject<boolean>(false) ;//quiero a ce cierren todos los modals cuando se produce un error de servidor 
  authDelTempOrder$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  closeIsLoading$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  noVerifiedError$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  noRoleError$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  labelInvalidCredential$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  status400Error$ : EventEmitter<response> = new EventEmitter<response>; 
  status429Error$ : EventEmitter<response> = new EventEmitter<response>; 
  status400VerifyError$ : EventEmitter<response> = new EventEmitter<response>; 
  status401Credentials$ : EventEmitter<response401Credentials> = new EventEmitter<response401Credentials>; 
  backIsDown$ : EventEmitter<response> = new EventEmitter<response>; 
  
  constructor(
              private store : Store <AppState>,
              private cookieService: CookieService,
              private router : Router

  ) { 
  }

  getError(error : any) {

    if (error.statusText === "Unknown Error" ) {
      this.closeIsLoading$.emit(true);
      this.backIsDown$.emit({emmited:true, msg: 'Erro Interno do Servidor. Desculpe, algo deu errado em nosso servidor. Por favor, tente novamente mais tarde' });     
      return of(null);
    }


    if (error.status === 401 && error.error.message === "Token expired") {
      localStorage.removeItem('logged');
      this.cookieService.delete('token');
      this.closeIsLoading$.emit(true);
      setTimeout(()=>{
        this.openDialogLogin();
      },500)
      return of(null);
    }

    if (error.status === 401 && error.error.message === "Você precisa de uma função de administrador para concluir esta ação") {
      alert("Necesitas rol de administrador");
      this.closeIsLoading$.emit(true);
      return of(null);
    }

    if (error.status === 401 && error.error.message === "Invalid Token") {
        this.logoutInvalidToken();
        this.openDialogLogin();
        this.close$.next(true);
        this.close$.next(false);
        this.closeIsLoading$.emit(true);
      return of(null);
    }

    if (error.status === 401 && error.error.message === "Credenciais incorretas") {
       this.status401Credentials$.emit( {emmited:true, msg:error.error.message, remainingAttempts: error.error.remainingAttempts } )
      this.closeIsLoading$.emit(true);
       return of(null);
    }

    if (error.status === 401 && error.error.message === 'Usuário não encontrado' ) {

      this.closeIsLoading$.emit(true);
       this.status429Error$.emit({emmited:true, msg: error.error.message });
     return of(null);
   }

    if (error.status === 401) {
      this.logout();
      this.openDialogLogin();
      this.close$.next(true);
      this.close$.next(false);
      // this.closeIsLoading$.emit(true);
      return of(null);
    }


  if (error.status === 500 && error.error.error === 'Usuário não encontrado' ) {
     this.closeIsLoading$.emit(true);
     this.status429Error$.emit({emmited:true, msg: error.error.message });
    return of(null);
  }

  if (error.status === 429 && error.error.message === "Você excedeu o limite de 3 tentativas de login. Por favor, aguarde 1 minutos antes de tentar novamente") {
      this.status429Error$.emit( {emmited:true, msg:error.error.message } )
     this.closeIsLoading$.emit(true);
      return of(null);
  }
    
  if (error.status === 500) {
      alert("Error en el back")
      // this.openDialogBackendDown();
      // this.closeIsLoading$.emit(true);
      return of(null);
  }

  if (error.status === 403 && error.error.message==="Credenciales invalidas." ) {
      this.closeIsLoading$.emit(true);
      this.labelInvalidCredential$.emit(true);
      return of(null);
  }

  if (error.status === 404 ) {
      this.closeIsLoading$.emit(true);
      this.openGenericMsgAlert('Internal Server Error. Sorry, something went wrong on our server. Please try again later')
      return of(null);
  }


  if (error.status === 400 && error.error.errors && Array.isArray(error.error.errors)) {
    const errors = error.error.errors;
    const errorMessages = errors.map((errorObj: any) => errorObj.msg);
    const errorMessage = errorMessages.join("\n");
    this.openGenericMsgAlert(errorMessage );
    return of(null);
  }


    if (error.status === 400 && error.error.message === "E-mail já em uso. Por favor, escolha um diferente" ) {
     this.closeIsLoading$.emit(true);
      this.status400Error$.emit({emmited:true, msg: error.error.message });
      return of(null);
    }

    
    if (error.status === 400 && error.error.message === "A nova conta de e-mail já está em uso por outro usuário" ) {
      this.closeIsLoading$.emit(true);
       this.status400Error$.emit({emmited:true, msg: error.error.message });
       return of(null);
     }
    

    if (error.status === 400 && error.error.message === "Usuário não verificado" ) {
      this.closeIsLoading$.emit(true);
       this.status400VerifyError$.emit({emmited:true, msg: error.error.message });
       return of(null);
     }
       

    if (error.status === 400 && error.error.message === "Usuário sem função" ) {
        this.noRoleError$.emit(true);
        return of(null);
    }

 
    if (error.status === 400) {
        this.openGenericMsgAlert(error.error.message);
        this.closeIsLoading$.emit(true);
        return of(null);
    }


    if (error.statusText === "Unknown Error" ) {
      this.closeIsLoading$.emit(true);
     
      this.openGenericMsgAlert('Internal Server Error. Sorry, something went wrong on our server. Please try again later')
      return of(null);
    }

    // Devuelve un observable que emite el error original
    return throwError(() => error);

  }

  logout(){
          this.close$.next(true);
          this.close$.next(false);
          localStorage.removeItem("logged");
          localStorage.removeItem("user");
          this.store.dispatch(authActions.unSetUser());
          this.cookieService.delete('token');
          this.router.navigateByUrl('login'); 
            
  }

  logoutInvalidToken(){
    sessionStorage.removeItem("token");
    this.close$.next(true);
    this.close$.next(false);
    localStorage.removeItem("logged");
    sessionStorage.removeItem("logged");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    this.cookieService.delete('token');
    this.store.dispatch(authActions.unSetUser());
    this.router.navigateByUrl('login'); 
  }
  


  openDialogLogin() {
    
  }

  openDialogBackendDown(){

    // let width : string = '';
    // let height : string = '';

    // if(screen.width >= 800) {
    //   width = "400px";
    //   height ="320px";
    // }
    // this.dialog.open(ErrorBackendDownComponent,{
    //   width: `${width}`|| "",
    //   height:`${height}`|| "",
    //   disableClose: true,
    //   panelClass:"custom-modalbox-message",
    // });
  }

  openGenericMsgAlert(msg : string){
  }

  openDialogNoAuth() {
 }

}
