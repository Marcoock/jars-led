import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css'
})
export class ThemeToggleComponent {
  isDarkMode = false;

  constructor(private elementRef: ElementRef) {}

  // Método para alternar entre temas
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const button = this.elementRef.nativeElement.querySelector('.theme-toggle');
    if (this.isDarkMode) {
      button.classList.add('active');
      document.body.classList.add('dark-theme'); // Agregar clase al body
    } else {
      button.classList.remove('active');
      document.body.classList.remove('dark-theme'); // Quitar clase del body
    }
  }

  // Escuchar clics en el botón o en sus elementos hijos (como el SVG)
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const button = this.elementRef.nativeElement.querySelector('.theme-toggle');
    // Verificar si el clic fue en el botón o en un elemento dentro del botón
    if (button.contains(event.target as Node)) {
      this.toggleTheme();
    }
  }
}