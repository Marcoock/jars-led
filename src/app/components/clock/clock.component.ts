import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css'
})
export class ClockComponent implements OnInit, OnDestroy {
  horas: string = '00';
  minutos: string = '00';
  segundos: string = '00';
  timeDate: string = ''; // Para manejar AM/PM
  private intervalo: any;

  constructor() { }

  ngOnInit(): void {
    this.actualizarHora();
    this.intervalo = setInterval(() => {
      this.actualizarHora();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  private actualizarHora(): void {
    const ahora = new Date();
    let horas = ahora.getHours();
    const minutos = ahora.getMinutes();
    const segundos = ahora.getSeconds();

    // Convertir a formato 12 horas y determinar AM/PM
    this.timeDate = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12 || 12; // Convierte 0 a 12

    // Formatear para que siempre tenga dos dígitos
    this.horas = this.agregarCero(horas);
    this.minutos = this.agregarCero(minutos);
    this.segundos = this.agregarCero(segundos);
  }

  private agregarCero(valor: number): string {
    return valor < 10 ? `0${valor}` : `${valor}`;
  }
}