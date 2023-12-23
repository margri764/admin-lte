import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session/session.service';
import { AppState } from '../redux/app.reducer';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter } from 'rxjs';
import { getDataLS, getDataSS, saveDataSS } from '../storage';
import { Router } from '@angular/router';
import { ErrorService } from '../services/error/error.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  sessionTimeRemaining!: number;
  user:any;
  profilePicture : string = 'assets/no-image.jpg'

  constructor(
              private sessionService : SessionService,
              private router : Router,
              private errorService : ErrorService,
              // private store : Store <AppState>,
  )
   {
      this.sessionService.startSession();

      const session = getDataSS('session');
      const user = getDataLS('user');

      if(session && session.Ruta_Imagen){
        this.getImage(session.Ruta_Imagen);
      }else if(user && user.Ruta_Imagen){
        this.getImage(user.Ruta_Imagen);
      }
   }
  
  
   ngOnInit(): void {

    this.sessionService.getClock().subscribe((timeRemaining: number) => {
      this.sessionTimeRemaining = timeRemaining;
     
      
      const user = getDataLS("user");

      if(timeRemaining === 0){
        this.sessionService.startSession();

        saveDataSS('session', user)
        
        this.router.navigateByUrl('/sessao-expirada')
      }
      if(user !== undefined){
        this.user = user
      }

    });

  }

  getImage( path:string ){
    console.log(path);
    if(path.startsWith('/var/www/propulsao')){
      const fileName = path.split('/').pop();
      const serverURL = 'https://arcanjosaorafael.org/profilePicture/';
      this.profilePicture = `${serverURL}${fileName}`;
    }else{
      this.profilePicture= path;
    }
  }


  logout(){
    setTimeout(()=>{ this.errorService.logout(); },600)
    
  }

}
