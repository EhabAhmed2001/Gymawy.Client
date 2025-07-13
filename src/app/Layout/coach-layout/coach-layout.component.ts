import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoachNavbarComponent } from "../../Components/coach/coach-navbar/coach-navbar.component";

@Component({
  selector: 'app-coach-layout',
  imports: [RouterOutlet, CoachNavbarComponent],
  templateUrl: './coach-layout.component.html',
  styleUrl: './coach-layout.component.css'
})
export class CoachLayoutComponent {

}
