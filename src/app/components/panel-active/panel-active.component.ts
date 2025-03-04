import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { SectionsService } from '../../services/sections/sections.service';
import { ProgressTimerComponent } from '../progress-timer/progress-timer.component';
import { FormModalComponent } from '../form-modal/form-modal.component';
import { SerialConnectionService } from '../../services/serial-connection.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-panel-active',
  standalone: true,
  imports: [CommonModule, ProgressTimerComponent, FormModalComponent],
  templateUrl: './panel-active.component.html',
  styleUrl: './panel-active.component.css'
})
export class PanelActiveComponent implements OnDestroy {

  private destroy$ = new Subject<void>();
  seccion: any;
  data: any[] = [];
  nombreSeccionA: string = ''; // Nueva propiedad para el nombre de la sección A
  idActivacionModal: number = 0; // Variable para almacenar el id_activacion

  constructor(private sectionService: SectionsService, private serviceConex: SerialConnectionService) { }

  idActivacionA: number = 0;
  idActivacionB: number = 0;
  idValvulaA: number = 0;
  idValvulaB: number = 0;
  activacionA: string = '';
  activacionB: string = '';
  horaA: string = '';
  horaB: string = '';
  duration: string = '';
  frequency: string = '';
  duration2: string = '';
  frequency2: string = '';
  totalTimeD: number = 0;
  totalTimeF: number = 0;
  totalTimeD2: number = 0;
  totalTimeF2: number = 0;
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


  ngOnInit() {
    this.sectionService.seccionActiva$
      .pipe(takeUntil(this.destroy$))
      .subscribe(seccion => {
        this.seccion = seccion;
        this.obtenerDatosSeccion(seccion.section);
      });
  }

  obtenerDatosSeccion(section: string) {
    this.serviceConex.getSeccion(section)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {

          // Asignar dinámicamente los datos
          if (response.length > 0) {
            // Sección A (primer elemento del array)
            const seccionA = response[0];
            if (seccionA) {
              this.nombreSeccionA = `Sección ${seccionA.seccion}`; // Asignar nombre de la sección
              this.activacionA = seccionA.activacion;
              this.horaA = this.convertirHoraFormato12(seccionA.hora_activacion);
              this.duration = this.convertirDuracionAMinutosSegundos(seccionA.duracion);
              this.frequency = seccionA.frecuencia;
              this.totalTimeD = this.convertirTiempoASegundos(seccionA.duracion);
              this.totalTimeF = this.convertirTiempoASegundos(seccionA.frecuencia);
              this.idValvulaA = seccionA.id_valvula;
              this.idActivacionA = seccionA.id_activacion
            }

            // Sección B (segundo elemento del array)
            if (response.length > 1) {
              const seccionB = response[1];
              if (seccionB) {
                this.activacionB = seccionB.activacion;
                this.horaB = this.convertirHoraFormato12(seccionB.hora_activacion);
                this.duration2 = this.convertirDuracionAMinutosSegundos(seccionB.duracion);
                this.frequency2 = seccionB.frecuencia;
                this.totalTimeD2 = this.convertirTiempoASegundos(seccionB.duracion);
                this.totalTimeF2 = this.convertirTiempoASegundos(seccionB.frecuencia);
                this.idValvulaB = seccionB.id_valvula;
                this.idActivacionB = seccionB.id_activacion
              }
            }
          }
        },
        error: (err) => console.error('Error al obtener datos:', err),
      });
  }

  // Método para convertir tiempo (HH:MM:SS o MM:SS) a segundos
  convertirTiempoASegundos(tiempo: string): number {
    const partes = tiempo.split(':');
    if (partes.length === 3) { // Formato HH:MM:SS
      const horas = parseInt(partes[0], 10);   // Base 10 para horas
      const minutos = parseInt(partes[1], 10); // Base 10 para minutos
      const segundos = parseInt(partes[2], 10); // Base 10 para segundos
      return horas * 3600 + minutos * 60 + segundos;
    } else if (partes.length === 2) { // Formato MM:SS
      const minutos = parseInt(partes[0], 10); // Base 10 para minutos
      const segundos = parseInt(partes[1], 10); // Base 10 para segundos
      return minutos * 60 + segundos;
    }
    return 0; // Si no coincide con ningún formato
  }

  convertirHoraFormato12(hora24: string): string {
    // Dividir la hora en horas, minutos y segundos
    const [horas, minutos, segundos] = hora24.split(':');

    // Convertir las horas a número
    let horasNum = parseInt(horas, 10);

    // Determinar si es AM o PM
    const periodo = horasNum >= 12 ? 'PM' : 'AM';

    // Convertir a formato de 12 horas
    if (horasNum > 12) {
      horasNum -= 12;
    } else if (horasNum === 0) {
      horasNum = 12; // Medianoche (00:00) se convierte a 12:00 AM
    }

    // Formatear la hora como "H:MM AM/PM"
    return `${horasNum}:${minutos} ${periodo}`;
  }

  convertirDuracionAMinutosSegundos(duracion: string): string {
    // Dividir la duración en horas, minutos y segundos
    const [horas, minutos, segundos] = duracion.split(':');

    // Convertir las horas y minutos a números
    const horasNum = parseInt(horas, 10);
    const minutosNum = parseInt(minutos, 10);
    const segundosNum = parseInt(segundos, 10);

    // Calcular el total de minutos y segundos
    const totalMinutos = horasNum * 60 + minutosNum;
    const totalSegundos = segundosNum;

    // Formatear como "MM:SS"
    return `${this.agregarCeros(totalMinutos)}:${this.agregarCeros(totalSegundos)}`;
  }

  // Método auxiliar para agregar ceros a la izquierda si es necesario
  agregarCeros(valor: number): string {
    return valor < 10 ? `0${valor}` : `${valor}`;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  transferirAgua(idValvula: number) {
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
    if (estaLlenoA) {
      this.serviceConex.getEncender(idValvula).subscribe({
        next: () => console.log('LED encendido'),
        error: (err) => console.error('Error al encender LED:', err),
      });
    } else {
      this.serviceConex.getApagar(idValvula).subscribe({
        next: () => console.log('LED apagado'),
        error: (err) => console.error('Error al apagar LED:', err),
      });
    }
  }

  abrirModal(sectionStyle: 'A' | 'B', idActivacion: number,): void {
    this.mostrarModal = true; // Cambia el valor a true para mostrar el modal
    this.styleModal = sectionStyle; // Define el estilo del modal
    this.idActivacionModal = idActivacion; // Guarda el id para pasarlo al modal
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
