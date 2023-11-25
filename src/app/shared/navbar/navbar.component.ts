import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session/session.service';
import { AppState } from '../redux/app.reducer';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter } from 'rxjs';

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
              private store : Store <AppState>,
  )
   {
      this.sessionService.startSession();
   }
  
  
   ngOnInit(): void {

    this.sessionService.getClock().subscribe((timeRemaining: number) => {
      this.sessionTimeRemaining = timeRemaining;
      if(timeRemaining === 0){
      this.sessionService.startSession();

      }
    });

    this.store.select('auth')
    .pipe(
    filter( ({user})=>  user != null && user != undefined),
    distinctUntilChanged((prev, curr) => prev.user === curr.user)
    ).subscribe(
    ({user})=>{
    this.user = { name:user?.name, lastName: user?.lastName, role:user?.role} ;
    // this.isLoading = false;
  })
  }

}
