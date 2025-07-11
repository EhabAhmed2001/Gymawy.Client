import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-as',
  imports: [],
  templateUrl: './welcome-as.component.html',
  styleUrl: './welcome-as.component.css'
})
export class WelcomeAsComponent {



constructor(private router: Router) {}

   navigateTo(role: string) {
    this.router.navigate([`/register/${role}`]);
  }
}
