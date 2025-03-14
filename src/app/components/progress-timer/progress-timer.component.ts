import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { SectionsService } from '../../services/sections/sections.service';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-progress-timer',
  standalone: true,
  imports: [RoundProgressModule, CommonModule],
  templateUrl: './progress-timer.component.html',
  styleUrls: ['./progress-timer.component.css']
})
export class ProgressTimerComponent implements OnChanges {
  @Input() description!: string;
  @Input() totalTime!: number;
  @Input() color!: string;
  @Input() type!: string;
  @Input() activationTime!: string; // Hora de activación en formato HH:MM:SS
  @Input() frequency!: string;       // Frecuencia del ciclo
  @Input() idValvula!: number;       // Identificador de la válvula

  remainingTime!: number;
  timeFormatted!: string;
  private destroy$ = new Subject<void>();

  private countdownInterval: any; // Almacena el ID del intervalo
  private paused: boolean = false; // Nueva variable para manejar la pausa

  constructor(private cdr: ChangeDetectorRef, private comunicacionService: SectionsService) { }

  ngOnChanges(changes: SimpleChanges) {
    // Limpiar el intervalo anterior si existe
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    if (changes['totalTime'] && changes['totalTime'].currentValue !== undefined) {
      this.remainingTime = this.totalTime;
      this.formatTime();
      this.comunicacionService.startCountdown$
        .pipe(takeUntil(this.destroy$))
        .subscribe((idValvula: number) => {
          if (idValvula === this.idValvula) {
            console.log(`Evento recibido: startCountdown para válvula ${idValvula}`);
            this.startCountdown();
          }
        });
      this.comunicacionService.stopCountdown$
        .pipe(takeUntil(this.destroy$))
        .subscribe((idValvula: number) => {
          if (idValvula === this.idValvula) {
            console.log(`Evento recibido: stopCountdown para válvula ${idValvula}`);
            this.pauseCountdown();
          }
        });
    }

    // 🟢 Si el tipo es 'frecuencia', calcular cuánto falta para la siguiente activación
    if (this.type.includes('frecuencia') && this.activationTime) {
      this.remainingTime = this.calcularTiempoRestante(this.activationTime);
      this.formatTime();
      this.startCountdown();
    }
  }

  // ⏳ Calcula el tiempo restante hasta la próxima activación en segundos
  calcularTiempoRestante(activationTime: string): number {
    const ahora = new Date();
    const [hora, minutos, segundos] = activationTime.split(':').map(Number);

    // Validar la entrada (hora, minutos, segundos) para evitar NaN
    if (isNaN(hora) || isNaN(minutos) || isNaN(segundos)) {
      console.error('Formato de hora no válido');
      return 0;
    }

    const activacion = new Date();
    activacion.setHours(hora, minutos, segundos, 0);

    // Si la activación es en el futuro, calculamos la diferencia
    let diferencia = activacion.getTime() - ahora.getTime();
    
    // Si la activación ya pasó hoy, sumamos 24 horas para obtener el siguiente ciclo
    if (diferencia < 0) {
      diferencia += 24 * 60 * 60 * 1000; // 24 horas en milisegundos
    }

    return Math.floor(diferencia / 1000); // Convertir a segundos
  }

  startCountdown() {
    this.paused = false; // Aseguramos que no esté en pausa
    this.countdownInterval = setInterval(() => {
      if (this.remainingTime > 0 && !this.paused) {
        this.remainingTime--;
        this.formatTime();
        this.cdr.detectChanges(); // Forzar la detección de cambios
      } else {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  pauseCountdown() {
    // Al recibir stopCountdown, solo pausamos el contador (sin detener el intervalo)
    this.paused = true;
  }

  formatTime() {
    const hours = Math.floor(this.remainingTime / 3600);
    const minutes = Math.floor((this.remainingTime % 3600) / 60);
    const seconds = this.remainingTime % 60;
    this.timeFormatted = `${hours}h : ${minutes}m : ${seconds}s`;
  }

  ngOnDestroy() {
    // Limpiar el intervalo cuando el componente se destruye
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
