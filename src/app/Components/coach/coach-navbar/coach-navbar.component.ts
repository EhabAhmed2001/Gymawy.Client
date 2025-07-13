import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';

@Component({
  selector: 'app-coach-navbar',
  imports: [CommonModule,RouterModule, RouterLink],
  templateUrl: './coach-navbar.component.html',
  styleUrl: './coach-navbar.component.css'
})
export class CoachNavbarComponent {

  constructor(public _authService:AuthService) {


    }
    logout(): void {
      this._authService.logout();
    }

    
}
