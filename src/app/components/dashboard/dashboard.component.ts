import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClockComponent } from '../clock/clock.component';
import { PanelActiveComponent } from '../panel-active/panel-active.component';
import { SectionsService } from '../../services/sections/sections.service';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule, ClockComponent, PanelActiveComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  public value = ['A', 'D', 'V'];

  public sections = [
    { section: 1, activation: 'S1', status: 'A' },
    { section: 2, activation: 'S3', status: 'D' },
    { section: 3, activation: 'S4', status: 'A' },
    { section: 4, activation: 'S5', status: 'V' },
    { section: 5, activation: 'Q1', status: 'A' },
    { section: 6, activation: 'Q3', status: 'V' },
    { section: 7, activation: 'Q4', status: 'A' },
    { section: 8, activation: 'Q5', status: 'V' }
  ]

  constructor(private sectionService: SectionsService) {}

  ngOnInit(): void {
    if (this.sections.length > 0) {
      this.sectionService.setSeccion(this.sections[0]); // Envía la primera sección
    }
  }

  seleccionarSeccion(seccion: any): void {
    this.sectionService.setSeccion(seccion); // Envía la nueva sección cuando el usuario selecciona una
  }

}
