import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';
import { SerialConnectionService } from './services/serial-connection.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CTV-COLPOS';

  constructor(private serviceConex: SerialConnectionService) { }

  transferirAgua() {
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
      this.serviceConex.getEncender().subscribe({
        next: () => console.log('LED encendido'),
        error: (err) => console.error('Error al encender LED:', err),
      });
    } else {
      this.serviceConex.getApagar().subscribe({
        next: () => console.log('LED apagado'),
        error: (err) => console.error('Error al apagar LED:', err),
      });
    }
  }
}
