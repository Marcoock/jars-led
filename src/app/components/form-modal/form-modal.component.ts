import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-modal.component.html',
  styleUrl: './form-modal.component.css'
})
export class FormModalComponent {
  @Input() sectionStyle: 'A' | 'B' = 'A'; // Estilo del modal (azul o rosado)
  @Output() cerrarModal = new EventEmitter<void>(); // Evento para cerrar el modal
  @Output() confirmarModal = new EventEmitter<any>(); // Evento para confirmar y enviar datos

  data: any = { activacion: "12-03-00" }; // Objeto para enlazar con ngModel

  tiempoForm: FormGroup;
  horas: string[] = [];
  minutos: string[] = [];
  segundos: string[] = [];

  constructor(private fb: FormBuilder) {
    this.tiempoForm = this.fb.group({
      frecuencia: ['00:00:00'],
      duracion: ['00:00']
    });

    this.generarOpciones();
  }

  generarOpciones(): void {
    for (let i = 0; i < 24; i++) {
      this.horas.push(i.toString().padStart(2, '0'));
    }
    for (let i = 0; i < 60; i++) {
      this.minutos.push(i.toString().padStart(2, '0'));
      this.segundos.push(i.toString().padStart(2, '0'));
    }
  }

  actualizarFrecuencia(event: Event, tipo: 'hora' | 'minuto' | 'segundo'): void {
    const valor = (event.target as HTMLSelectElement)?.value || '00';
    const [h, m, s] = this.tiempoForm.value.frecuencia.split(':');
    
    this.tiempoForm.patchValue({
      frecuencia: tipo === 'hora' ? `${valor}:${m}:${s}` :
                  tipo === 'minuto' ? `${h}:${valor}:${s}` :
                  `${h}:${m}:${valor}`
    });
  }

  actualizarDuracion(event: Event, tipo: 'minuto' | 'segundo'): void {
    const valor = (event.target as HTMLSelectElement)?.value || '00';
    const [m, s] = this.tiempoForm.value.duracion.split(':');
    
    this.tiempoForm.patchValue({
      duracion: tipo === 'minuto' ? `${valor}:${s}` : `${m}:${valor}`
    });
  }

  enviarFormulario(): void {
    console.log('Valores enviados:', this.tiempoForm.value);
    // Aquí puedes enviar los datos a la base de datos
  }

  cerrar(): void {
    this.cerrarModal.emit(); // Emite el evento para cerrar el modal
  }

  confirmar(): void {
    this.confirmarModal.emit({ role: 'creado', data: this.data }); // Emite el evento con los datos
    console.log(this.confirmarModal);
    
  }
}