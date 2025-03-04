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
    { section: 1, activation: 'S1', status: 'A', color:'#A3D4DA', border:'#23A1AA' },
    { section: 2, activation: 'S3', status: 'D', color:'#41d381', border:'#23aa4f' },
    { section: 3, activation: 'S4', status: 'A', color:'#baa3da', border:'#5923aa' },
    { section: 4, activation: 'S5', status: 'V', color:'#9dbf63', border:'#80aa23' },
    { section: 5, activation: 'Q1', status: 'A', color:'#daa3ca', border:'#aa2391' },
    { section: 6, activation: 'Q3', status: 'V', color:'#d97a4f', border:'#aa2323' },
    { section: 7, activation: 'Q4', status: 'A', color:'#c54b69', border:'#aa2372' },
    { section: 8, activation: 'Q5', status: 'V', color:'#60b5a0', border:'#23aa7a' }
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
