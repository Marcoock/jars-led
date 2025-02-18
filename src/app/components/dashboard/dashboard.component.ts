import { Component, OnInit } from '@angular/core';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { gsap } from 'gsap';



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
  duration = '2m:00s';
  frequency2 = '04h:00m';
  duration2 = '2m:00s';
  totalTimeD = 2 * 60;
  totalTimeF = 2 * 60; // 4 horas en segundos
  totalTimeD2 = 3 * 60;
  totalTimeF2 = 3 * 60; // 4 horas en segundos
  remainingTimeF = this.totalTimeF;
  remainingTimeD = this.totalTimeD;
  timeFormattedD = '';
  timeFormattedF = '';
  remainingTimeF2 = this.totalTimeF2;
  remainingTimeD2 = this.totalTimeD2;
  timeFormattedD2 = '';
  timeFormattedF2 = '';

  ngOnInit() {
    this.formatTimeF();
    this.startCountdownF();
    this.formatTimeD();
    this.startCountdownD();
    
    this.formatTimeF2();
    this.startCountdownF2();
    this.formatTimeD2();
    this.startCountdownD2();
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

  startCountdownF() {
    const interval = setInterval(() => {
      if (this.remainingTimeF > 0) {
        this.remainingTimeF--;
        this.formatTimeF();
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  formatTimeF() {
    const hours = Math.floor(this.remainingTimeF / 3600);
    const minutes = Math.floor((this.remainingTimeF % 3600) / 60);
    const seconds = this.remainingTimeF % 60;
    this.timeFormattedF = `${hours}h : ${minutes}m : ${seconds}s`;
  }

  startCountdownD() {
    const interval = setInterval(() => {
      if (this.remainingTimeD > 0) {
        this.remainingTimeD--;
        this.formatTimeD();
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  formatTimeD() {
    const hours = Math.floor(this.remainingTimeD / 3600);
    const minutes = Math.floor((this.remainingTimeD % 3600) / 60);
    const seconds = this.remainingTimeD % 60;
    this.timeFormattedD = `${hours}h : ${minutes}m : ${seconds}s`;
  }

  startCountdownF2() {
    const interval = setInterval(() => {
      if (this.remainingTimeF2 > 0) {
        this.remainingTimeF2--;
        this.formatTimeF2();
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  formatTimeF2() {
    const hours = Math.floor(this.remainingTimeF2 / 3600);
    const minutes = Math.floor((this.remainingTimeF2 % 3600) / 60);
    const seconds = this.remainingTimeF2 % 60;
    this.timeFormattedF2 = `${hours}h : ${minutes}m : ${seconds}s`;
  }

  startCountdownD2() {
    const interval = setInterval(() => {
      if (this.remainingTimeD2 > 0) {
        this.remainingTimeD2--;
        this.formatTimeD2();
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  formatTimeD2() {
    const hours = Math.floor(this.remainingTimeD2 / 3600);
    const minutes = Math.floor((this.remainingTimeD2 % 3600) / 60);
    const seconds = this.remainingTimeD2 % 60;
    this.timeFormattedD2 = `${hours}h : ${minutes}m : ${seconds}s`;
  }
  
}
