import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClockComponent } from '../clock/clock.component';
import { PanelActiveComponent } from '../panel-active/panel-active.component';
import { SectionsService } from '../../services/sections/sections.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { WebSocketService } from '../../services/WebSocket/web-socket.service';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ClockComponent, PanelActiveComponent, ThemeToggleComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {

  public value = ['A', 'D', 'V'];

  public sections = [
    { section: 1, activation: 'S1', valveA: 1, valveB: 2, status: 'V', color: '#A3D4DA', border: '#23A1AA' },
    { section: 2, activation: 'S3', valveA: 3, valveB: 0, status: 'V', color: '#41d381', border: '#23aa4f' },
    { section: 3, activation: 'S4', valveA: 4, valveB: 0, status: 'V', color: '#baa3da', border: '#5923aa' },
    { section: 4, activation: 'S5', valveA: 5, valveB: 6, status: 'V', color: '#9dbf63', border: '#80aa23' },
    { section: 5, activation: 'Q1', valveA: 7, valveB: 8, status: 'V', color: '#daa3ca', border: '#aa2391' },
    { section: 6, activation: 'Q3', valveA: 9, valveB: 0, status: 'V', color: '#d97a4f', border: '#aa2323' },
    { section: 7, activation: 'Q4', valveA: 10, valveB: 0, status: 'V', color: '#c54b69', border: '#aa2372' },
    { section: 8, activation: 'Q5', valveA: 11, valveB: 12, status: 'V', color: '#60b5a0', border: '#23aa7a' }
  ]

  constructor(private sectionService: SectionsService, private wsService: WebSocketService) { }

  ngOnInit(): void {
    if (this.sections.length > 0) {
      this.sectionService.setSeccion(this.sections[0]); // Envía la primera sección
    }
    // Escuchar cambios en válvulas en tiempo real
    this.wsService.onValveUpdate().subscribe(data => {
      console.log('Cambio en válvula detectado:', data);
      // Buscar la sección afectada y actualizar su estado
      const sectionA = this.sections.find(s => s.valveA === data.id_valvula);
      const sectionB = this.sections.find(s => s.valveB === data.id_valvula);

      if (data.estado === 'ACTIVA') {
        // Si la válvula está activa, actualiza la sección correspondiente
        if (sectionA) {
          sectionA.status = 'A'; // Actualizar estado de sectionA
        }
        if (sectionB) {
          sectionB.status = 'A'; // Actualizar estado de sectionB
        }
      } else if (data.estado === 'INACTIVA') {
        // Si la válvula está inactiva, actualiza la sección correspondiente
        if (sectionA) {
          sectionA.status = 'V'; // Actualizar estado de sectionA
        }
        if (sectionB) {
          sectionB.status = 'V'; // Actualizar estado de sectionB
        }
      }
    });
  }

  seleccionarSeccion(seccion: any): void {
    this.sectionService.setSeccion(seccion); // Envía la nueva sección cuando el usuario selecciona una
  }

}
