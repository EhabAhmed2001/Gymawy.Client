import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from './Components/map/map.component';
import { AddGymComponent } from "./Components/add-gym/add-gym.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapComponent, AddGymComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GymManagement';
}
