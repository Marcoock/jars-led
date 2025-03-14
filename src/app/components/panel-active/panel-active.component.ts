import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { SectionsService } from '../../services/sections/sections.service';
import { ProgressTimerComponent } from '../progress-timer/progress-timer.component';
import { FormModalComponent } from '../form-modal/form-modal.component';
import { SerialConnectionService } from '../../services/serial-connection.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebSocketService } from '../../services/WebSocket/web-socket.service';

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

  constructor(private sectionService: SectionsService, private serviceConex: SerialConnectionService, private wsService: WebSocketService, private comunicacionService: SectionsService) { }

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
  siguienteActivacionA: string = '';
  siguienteActivacionB: string = '';
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

  public sections = [
    { section: '1', valveA: 1, valveB: 2 },
    { section: '2', valveA: 3, valveB: 0 },
    { section: '3', valveA: 4, valveB: 0 },
    { section: '4', valveA: 5, valveB: 6 },
    { section: '5', valveA: 7, valveB: 8 },
    { section: '6', valveA: 9, valveB: 0 },
    { section: '7', valveA: 10, valveB: 0 },
    { section: '8', valveA: 11, valveB: 12 }
  ]

  ngOnInit() {
    this.sectionService.seccionActiva$
      .pipe(takeUntil(this.destroy$))
      .subscribe(seccion => {
        this.seccion = seccion;
        this.obtenerDatosSeccion(seccion.section);
      });

    this.wsService.onValveUpdate().subscribe(data => {
      // Buscar la sección afectada y actualizar su estado
      const section = this.sections.find(s => s.valveA === data.id_valvula || s.valveB === data.id_valvula);
      console.log(this.seccion);

      if (section) {
        if (data.estado === 'ACTIVA') {
          this.obtenerDatosSeccion(section.section);
          this.comunicacionService.emitStartCountdown(data.id_valvula); // Emitir evento con el id de la válvula
          if (data.id_valvula === section.valveA) {
            this.transferirDerechaAIzquierda(); // Válvula B activada: líquido a la izquierda
          } else if (data.id_valvula === section.valveB) {
            this.transferirIzquierdaADerecha(); // Válvula A activada: líquido a la derecha
          }
        } else if (data.estado === 'INACTIVA') {
          setTimeout(() => {
            this.obtenerDatosSeccion(section.section);
            console.log('Datos Actualizados');
            this.comunicacionService.emitStopCountdown(data.id_valvula); // Emitir evento con el id de la válvula
          }, 2000);
        }
      }
    });
  }

  obtenerDatosSeccion(section: string) {
    // Limpiar los datos antes de hacer la nueva petición
    this.limpiarDatosSecciones();

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
              this.idActivacionA = seccionA.id_activacion;

              this.siguienteActivacionA = this.calcularSiguienteActivacion(seccionA.hora_activacion, this.frequency);
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
                this.idActivacionB = seccionB.id_activacion;

                this.siguienteActivacionB = this.calcularSiguienteActivacion(seccionB.hora_activacion, this.frequency2);
              }
            }
          }
        },
        error: (err) => console.error('Error al obtener datos:', err),
      });
  }

  limpiarDatosSecciones() {
    // Limpiar los datos de la sección A
    this.nombreSeccionA = '';
    this.activacionA = '';
    this.horaA = '';
    this.duration = '';
    this.frequency = '';
    this.totalTimeD = 0;
    this.totalTimeF = 0;
    this.idValvulaA = 0;
    this.idActivacionA = 0;
    this.siguienteActivacionA = '';

    // Limpiar los datos de la sección B
    this.activacionB = '';
    this.horaB = '';
    this.duration2 = '';
    this.frequency2 = '';
    this.totalTimeD2 = 0;
    this.totalTimeF2 = 0;
    this.idValvulaB = 0;
    this.idActivacionB = 0;
    this.siguienteActivacionB = '';
  }

  calcularSiguienteActivacion(horaActivacion: string, frecuencia: string): string {
    const ahora = new Date();
    const [hora, minutos, segundos] = horaActivacion.split(':').map(Number);
    const [freqHoras, freqMinutos, freqSegundos] = frecuencia.split(':').map(Number);

    // Crear la fecha con la hora de activación
    let proximaActivacion = new Date(ahora);
    proximaActivacion.setHours(hora, minutos, segundos, 0);

    // Si la activación ya pasó, sumarle la frecuencia para calcular la siguiente
    while (proximaActivacion <= ahora) {
      proximaActivacion.setHours(
        proximaActivacion.getHours() + freqHoras,
        proximaActivacion.getMinutes() + freqMinutos,
        proximaActivacion.getSeconds() + freqSegundos
      );
    }

    // Retornar la hora en formato HH:MM:SS
    return proximaActivacion.toTimeString().split(' ')[0];
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

  toggleValvula(event: any, idValvula: number) {
    if (event.target.checked) {
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

  // transferirAgua(idValvula: number) {
  //   const aguaLleno = document.querySelector('.agua-lleno') as HTMLElement;
  //   const aguaVacio = document.querySelector('.agua-vacio') as HTMLElement;

  //   if (!aguaLleno || !aguaVacio) return;

  //   // Obtener la altura en píxeles
  //   const alturaActual = parseFloat(window.getComputedStyle(aguaLleno).height);

  //   // Obtener la altura máxima (correspondiente al 74%)
  //   const alturaMaxima = aguaLleno.parentElement!.clientHeight * 0.50;

  //   // Determinar si el frasco A está lleno
  //   const estaLlenoA = alturaActual >= alturaMaxima - 1; // Margen de error pequeño

  //   // Animación con GSAP
  //   gsap.to(aguaLleno, { height: estaLlenoA ? '0%' : '50%', duration: 120 });
  //   gsap.to(aguaVacio, { height: estaLlenoA ? '50%' : '0%', duration: 120 });

  //   // Encender o apagar el LED según el estado del agua
  //   if (estaLlenoA) {
  //     this.serviceConex.getEncender(idValvula).subscribe({
  //       next: () => console.log('LED encendido'),
  //       error: (err) => console.error('Error al encender LED:', err),
  //     });
  //   } else {
  //     this.serviceConex.getApagar(idValvula).subscribe({
  //       next: () => console.log('LED apagado'),
  //       error: (err) => console.error('Error al apagar LED:', err),
  //     });
  //   }
  // }

  // Método para transferir líquido del frasco derecho al izquierdo
  transferirDerechaAIzquierda() {
    const aguaLleno = document.querySelector('.bit-B .liquido') as HTMLElement;
    const aguaVacio = document.querySelector('.bit-A .liquido') as HTMLElement;

    // Animación para vaciar el frasco derecho
    gsap.to(aguaLleno, { height: 0, duration: 60 });

    // Animación para llenar el frasco izquierdo
    gsap.to(aguaVacio, { height: '50%', duration: 60 });
  }

  // Método para regresar líquido del frasco izquierdo al derecho
  transferirIzquierdaADerecha() {
    const aguaLleno = document.querySelector('.bit-A .liquido') as HTMLElement;
    const aguaVacio = document.querySelector('.bit-B .liquido') as HTMLElement;

    // Animación para vaciar el frasco izquierdo
    gsap.to(aguaLleno, { height: 0, duration: 60 });

    // Animación para llenar el frasco derecho
    gsap.to(aguaVacio, { height: '50%', duration: 60 });
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
      console.log('Datos guardados:', event.data); // Verifica que los datos se reciban correctamente
      this.actualizarDatos(); // Llama a la función para actualizar los datos
    }
    this.mostrarModal = false; // Cierra el modal después de confirmar
  }

  // Método para actualizar los datos
  actualizarDatos(): void {
    // Aquí puedes volver a cargar los datos necesarios
    this.obtenerDatosSeccion(this.seccion.section); // Por ejemplo, recargar los datos de la sección
  }

}
