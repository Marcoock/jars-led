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

}
