import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
constructor(private router: Router) {}
 signOut(event: Event): void {
    event.preventDefault();
    
    if (confirm('Are you sure you want to sign out?')) {
      // Add your authentication service logic here
      // Example: this.authService.signOut();
      
      // Redirect to login page
      this.router.navigate(['/login']);
    }
}}
