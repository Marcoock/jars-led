import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SerialConnectionService {

  private conexion = 'http://127.0.0.1:5000/';

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
