import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SerialConnectionService {

  private conexion = 'https://api-led.vercel.app/';

  constructor(private http: HttpClient) { }

  //encender led
  getEncender(): Observable<any> {
    return this.http.get(this.conexion + 'encender');
  }

  //apagar Led
  getApagar(): Observable<any> {
    return this.http.get(this.conexion + 'apagar');
  }
}
