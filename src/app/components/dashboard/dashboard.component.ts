import { Component, OnInit } from '@angular/core';
import { RoundProgressModule } from 'angular-svg-round-progressbar';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RoundProgressModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  seccionActivo: string = 'Sección 1';
  activacionA: string = 'Activación S1';
  activacionB: string = 'Activación S2';

  frequency = '04h:00m';
  totalTime = 5 * 60; // 4 horas en segundos
  remainingTime = this.totalTime;
  timeFormatted = '';

  ngOnInit() {
    this.formatTime();
    this.startCountdown();
  }

  seleccionarSeccion(seccion: string, activacion1: string, activacion2: string): void {
    this.seccionActivo = `Sección ${seccion}`;
    this.activacionA = `Activación ${activacion1}`;
    this.activacionB = `Activación ${activacion2}`;
  }

  transferirAgua() {
    const aguaLleno = document.querySelector('.agua-lleno') as HTMLElement;
    const aguaVacio = document.querySelector('.agua-vacio') as HTMLElement;

    if (!aguaLleno || !aguaVacio) return;

    // Obtener la altura en píxeles
    const alturaActual = parseFloat(window.getComputedStyle(aguaLleno).height);

    // Obtener la altura máxima (correspondiente al 74%)
    const alturaMaxima = aguaLleno.parentElement!.clientHeight * 0.74;

    // Determinar si el frasco A está lleno
    const estaLlenoA = alturaActual >= alturaMaxima - 1; // Margen de error pequeño

    // Animación con GSAP
    gsap.to(aguaLleno, { height: estaLlenoA ? '0%' : '74%', duration: 1 });
    gsap.to(aguaVacio, { height: estaLlenoA ? '74%' : '0%', duration: 1 });

    // Encender o apagar el LED según el estado del agua
    // if (estaLlenoA) {
    //   this.serviceConex.getEncender().subscribe({
    //     next: () => console.log('LED encendido'),
    //     error: (err) => console.error('Error al encender LED:', err),
    //   });
    // } else {
    //   this.serviceConex.getApagar().subscribe({
    //     next: () => console.log('LED apagado'),
    //     error: (err) => console.error('Error al apagar LED:', err),
    //   });
    // }
  }

  startCountdown() {
    const interval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.formatTime();
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  formatTime() {
    const hours = Math.floor(this.remainingTime / 3600);
    const minutes = Math.floor((this.remainingTime % 3600) / 60);
    const seconds = this.remainingTime % 60;
    this.timeFormatted = `${hours}h : ${minutes}m : ${seconds}s`;
  }
  
}
