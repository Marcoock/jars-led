import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket = io('http://localhost:5000'); // Cambia por la URL de tu API

  constructor() {}

  // Escuchar cuando cambia una válvula
  onValveUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('estado_valvula', (data) => {
        observer.next(data);
      });

      // Manejo de desconexión
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
