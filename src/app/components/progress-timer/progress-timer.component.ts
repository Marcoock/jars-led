import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

@Component({
  selector: 'app-progress-timer',
  standalone: true,
  imports: [RoundProgressModule, CommonModule],
  templateUrl: './progress-timer.component.html',
  styleUrl: './progress-timer.component.css'
})
export class ProgressTimerComponent implements OnInit{
  @Input() description!: string;
  @Input() totalTime!: number;
  @Input() color!: string;
  @Input() type!: string;

  remainingTime!: number;
  timeFormatted!: string;

  ngOnInit() {
    this.remainingTime = this.totalTime;
    this.formatTime();
    this.startCountdown();
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
