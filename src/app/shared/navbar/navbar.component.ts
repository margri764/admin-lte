import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session/session.service';
import { AppState } from '../redux/app.reducer';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter } from 'rxjs';
import { getDataLS, saveDataSS } from '../storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  sessionTimeRemaining!: number;
  user:any;

  constructor(
              private sessionService : SessionService,
              private router : Router,
              private store : Store <AppState>,
  )
   {
      this.sessionService.startSession();
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
        this.user = { name: user?.name, role:user?.role } ;
      }

    });

  }

}
