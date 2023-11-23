import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  sessionTimeRemaining!: number;

  constructor(
              private sessionService : SessionService
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
  }

}
