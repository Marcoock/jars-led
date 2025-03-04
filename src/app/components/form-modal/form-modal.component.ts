import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { SerialConnectionService } from '../../services/serial-connection.service';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-modal.component.html',
  styleUrl: './form-modal.component.css'
})
export class FormModalComponent implements OnInit {
  @Input() sectionStyle: 'A' | 'B' = 'A'; // Estilo del modal (azul o rosado)
  @Input() idActivacion!: number; // Propiedad para recibir el id

  @Output() cerrarModal = new EventEmitter<void>(); // Evento para cerrar el modal
  @Output() confirmarModal = new EventEmitter<any>(); // Evento para confirmar y enviar datos

  data: any = { activacion: "12-03-00" }; // Objeto para enlazar con ngModel
  value: any;

  tiempoForm: FormGroup;
  horas: string[] = [];
  minutos: string[] = [];
  segundos: string[] = [];
  cambioHora: boolean = false; // Flag para detectar cambios
  desactivarProgramacion: boolean = false; // Propiedad para el estado del checkbox

  constructor(private fb: FormBuilder, private SerialConex: SerialConnectionService) {
    this.tiempoForm = this.fb.group({
      frecuencia: ['00:00:00'],
      duracion: ['00:00']
    });

    this.generarOpciones();
  }

  ngOnInit(): void {
    if (this.idActivacion) {
      this.SerialConex.getSeccionId(this.idActivacion).subscribe({
        next: (data: any) => {
          this.value = data[0]; // Asigna el primer elemento del array
          console.log('Datos recibidos:', this.value);
        },
        error: (err) => {
          console.error('Error al obtener datos:', err);
        },
      });
    } else {
      console.error('idActivacion no está definido');
    }
    this.cambioHora = false; // Se inicializa en falso
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

  cerrar(): void {
    this.cerrarModal.emit(); // Emite el evento para cerrar el modal
  }

  onHoraCambio() {
    this.cambioHora = true; // Marca que el usuario sí cambió la hora
  }

  confirmar(): void {

    // Si el checkbox está marcado, ponemos todos los valores como null
    if (this.desactivarProgramacion) {
      // Crear el objeto con los datos del formulario
      const datos = {
        id_activacion: this.idActivacion, // ID de la activación
        hora_activacion: null, // Hora de activación
        frecuencia: '04:00:00', // Frecuencia (hh:mm:ss)
        duracion: '00:02:00' // Duración (mm:ss)
      };

      // Enviar los datos al backend
      this.SerialConex.actualizarProgramacion(datos).subscribe({
        next: (response) => {
          console.log('Respuesta del backend:', response);
          // alert('Programación actualizada correctamente');
          this.confirmarModal.emit({ role: 'creado', data: datos }); // Emitir evento de confirmación
        },
        error: (err) => {
          console.error('Error al actualizar la programación:', err);
          alert('Error al actualizar la programación');
        }
      });
    }
    else if (!this.cambioHora) { // Si no ha sido cambiado
      alert('Error al guardar datos, el campo "Hora de activación" no ha sido modificado.');
      return;
    }
    else if (this.tiempoForm.value.frecuencia == '00:00:00') {
      alert('Error al guardar datos. No se puede guardar el valor: 00:00:00 en el campo "Frecuencia de activación".')
    }
    else if (this.tiempoForm.value.duracion == '00:00') {
      alert('Error al guardar datos. No se puede guardar el valor: 00:00 en el campo "Duración de la activación".')
    }
    // Si el checkbox no está marcado, ponemos los valores de la forma como están
    else {
      // Crear el objeto con los datos del formulario
      const datos = {
        id_activacion: this.idActivacion, // ID de la activación
        hora_activacion: this.data.activacion, // Hora de activación
        frecuencia: this.tiempoForm.value.frecuencia, // Frecuencia (hh:mm:ss)
        duracion: "00:" + this.tiempoForm.value.duracion // Duración (mm:ss)
      };

      console.log(datos);

      // Enviar los datos al backend
      this.SerialConex.actualizarProgramacion(datos).subscribe({
        next: (response) => {
          console.log('Respuesta del backend:', response);
          // alert('Programación actualizada correctamente');
          this.confirmarModal.emit({ role: 'creado', data: datos }); // Emitir evento de confirmación
        },
        error: (err) => {
          console.error('Error al actualizar la programación:', err);
          alert('Error al actualizar la programación: ' + err);
        }
      });
    }
  }
}