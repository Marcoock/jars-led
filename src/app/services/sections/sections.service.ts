import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  constructor() { }

  private seccionActiva = new BehaviorSubject<any>(null);
  seccionActiva$ = this.seccionActiva.asObservable();

  private startCountdownSubject = new Subject<number>();
  private stopCountdownSubject = new Subject<number>();

  startCountdown$ = this.startCountdownSubject.asObservable();
  stopCountdown$ = this.stopCountdownSubject.asObservable();


  setSeccion(seccion: any) {
    this.seccionActiva.next(seccion);
  }

  emitStartCountdown(idValvula: number) {
    this.startCountdownSubject.next(idValvula);
  }

  emitStopCountdown(idValvula: number) {
    this.stopCountdownSubject.next(idValvula);
  }
}
