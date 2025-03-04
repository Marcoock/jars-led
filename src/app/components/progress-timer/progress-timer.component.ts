import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

@Component({
  selector: 'app-progress-timer',
  standalone: true,
  imports: [RoundProgressModule, CommonModule],
  templateUrl: './progress-timer.component.html',
  styleUrl: './progress-timer.component.css'
})
export class ProgressTimerComponent implements OnChanges {
  @Input() description!: string;
  @Input() totalTime!: number;
  @Input() color!: string;
  @Input() type!: string;
  @Input() activationTime!: string; // Hora de activación en formato HH:MM:SS

  remainingTime!: number;
  timeFormatted!: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalTime'] && changes['totalTime'].currentValue !== undefined) {
      this.remainingTime = this.totalTime;
      this.formatTime();
      this.startCountdown();
    }
    
    if (this.type.includes('frecuencia') && this.activationTime) {
      this.calculateTimeUntilNextActivation();
    }
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

  calculateTimeUntilNextActivation() {
    const now = new Date();
    const [hours, minutes, seconds] = this.activationTime.split(':').map(Number);
    const activationDate = new Date(now);
    activationDate.setHours(hours, minutes, seconds, 0);

    if (activationDate < now) {
      activationDate.setHours(activationDate.getHours() + Math.floor(this.totalTime / 3600));
      activationDate.setMinutes(activationDate.getMinutes() + Math.floor((this.totalTime % 3600) / 60));
      activationDate.setSeconds(activationDate.getSeconds() + (this.totalTime % 60));
    }
    
    this.remainingTime = Math.floor((activationDate.getTime() - now.getTime()) / 1000);
    this.formatTime();
  }
}
