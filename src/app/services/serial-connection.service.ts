import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SerialConnectionService {

  private conexion = 'http://127.0.0.1:5000/';

  constructor(private http: HttpClient) { }

  //encender válvula
  getEncender(idValvula: number): Observable<any> {
    return this.http.get(this.conexion + 'encender/' + idValvula);
  }

  //apagar válvula
  getApagar(idValvula: number): Observable<any> {
    return this.http.get(this.conexion + 'apagar/' + idValvula);
  }

  // Obtener datos de una sección específica
  getSeccion(valueSeccion: string): Observable<any> {
    return this.http.get(`${this.conexion}seccion/${valueSeccion}`);
  }

  getSeccionId(idValvula: number): Observable<any> {
    return this.http.get(this.conexion + 'seccion/valvula/' + idValvula);
  }

  actualizarProgramacion(datos: any): Observable<any> {
    return this.http.post(`${this.conexion}actualizar_programacion/${datos.id_activacion}`, datos)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        // Extraer el mensaje de error del servidor
        const errorMessage = error.error?.error || 'Error desconocido';
        return throwError(errorMessage); // Devuelve solo el mensaje de error
      })
    );
  }
}
