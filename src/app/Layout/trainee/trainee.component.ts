import { Component } from '@angular/core';
import { NavbarComponent } from "../../Components/trainee/navbar/navbar.component";
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-trainee',
  imports: [NavbarComponent, RouterOutlet,RouterModule],
  templateUrl: './trainee.component.html',
  styleUrl: './trainee.component.css'
})
export class TraineeComponent {

}
