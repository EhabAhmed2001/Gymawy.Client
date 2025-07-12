import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { AllClassesComponent } from "../all-classes/all-classes.component";
import { AllGymsComponent } from "../all-gyms/all-gyms.component";

@Component({
  selector: 'app-trainee-landing-page',
  imports: [AllClassesComponent, AllGymsComponent, NavbarComponent],
  templateUrl: './trainee-landing-page.component.html',
  styleUrl: './trainee-landing-page.component.css'
})
export class TraineeLandingPageComponent {

 selectedOption: 'gyms' | 'classes' | 'all' = 'all'; // Default to showing gyms

  constructor() { }

  onFilterChange(option: 'gyms' | 'classes' | 'all') {
    this.selectedOption = option;
    console.log(`Selected option: ${this.selectedOption}`);
  }

}
