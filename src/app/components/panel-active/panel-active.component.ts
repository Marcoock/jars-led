import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { SectionsService } from '../../services/sections/sections.service';
import { ProgressTimerComponent } from '../progress-timer/progress-timer.component';
import { FormModalComponent } from '../form-modal/form-modal.component';


@Component({
  selector: 'app-panel-active',
  standalone: true,
  imports: [ CommonModule, ProgressTimerComponent, FormModalComponent],
  templateUrl: './panel-active.component.html',
  styleUrl: './panel-active.component.css'
})
export class PanelActiveComponent implements OnInit {

  seccion: any = null;

  constructor(private sectionService: SectionsService) {}

  frequency = '04h:00m';
  duration = '2m:00s';
  frequency2 = '04h:00m';
  duration2 = '2m:00s';
  totalTimeD = 3*60;
  totalTimeF = 4*60; // 4 horas en segundos
  totalTimeD2 = 4*60*60;
  totalTimeF2 = 5*60; // 4 horas en segundos
  remainingTimeF = this.totalTimeF;
  remainingTimeD = this.totalTimeD;
  timeFormattedD = '';
  timeFormattedF = '';
  remainingTimeF2 = this.totalTimeF2;
  remainingTimeD2 = this.totalTimeD2;
  timeFormattedD2 = '';
  timeFormattedF2 = '';
  mostrarModal: boolean = false; 
  styleModal: 'A' | 'B' = 'A'; 
  // Se va a borrar
  activacionA: string = 'Activación S1';
  activacionB: string = 'Activación S2';

  ngOnInit() {
    
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

  abrirModal( sectionStyle: 'A' | 'B' ): void {
    this.mostrarModal = true; // Cambia el valor a true para mostrar el modal
    this.styleModal = sectionStyle; // Define el estilo del modal
  }

  cerrarModal(): void {
    this.mostrarModal = false; // Cambia el valor a false para ocultar el modal
  }

  confirmarModal(event: any): void {
    if (event.role === 'creado') {
      console.log('Proyecto creado:', event.data); // Verifica que los datos se reciban correctamente
    }
    this.mostrarModal = false; // Cierra el modal después de confirmar
  }

}
