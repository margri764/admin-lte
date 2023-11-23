import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {


  private clock$: Observable<number>;
  private sessionStartTime!: Date;

  constructor() {

    this.clock$ = interval(1000).pipe(
      // Emite el tiempo restante de la sesión cada segundo
      map(() => this.getSessionTimeRemaining())
    );
   }

   getClock(): Observable<number> {
    return this.clock$;
  }

  startSession(): void {
    this.sessionStartTime = new Date();
  }

  getSessionTimeRemaining(): number {
    const now = new Date();
    const sessionDuration = 10 * 10 * 1000; // Duración de la sesión en milisegundos (por ejemplo, 30 minutos)
    const elapsedTime = now.getTime() - this.sessionStartTime.getTime();
    const timeRemaining = sessionDuration - elapsedTime;
    return timeRemaining > 0 ? timeRemaining : 0;
  }
}
