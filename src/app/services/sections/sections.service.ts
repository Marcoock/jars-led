import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  constructor() { }

  private seccionActiva = new BehaviorSubject<any>(null);
  seccionActiva$ = this.seccionActiva.asObservable();

  setSeccion(seccion: any) {
    this.seccionActiva.next(seccion);
  }
  
}
