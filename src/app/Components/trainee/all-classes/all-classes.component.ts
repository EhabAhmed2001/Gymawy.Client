import { Component } from '@angular/core';
import { ClassService } from '../../../Services/class.service';
import { AllClasses } from '../../../Interface/Class';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-classes',
  imports: [CommonModule, RouterModule],
  templateUrl: './all-classes.component.html',
  styleUrl: './all-classes.component.css'
})
export class AllClassesComponent {

  allClasses: AllClasses[] = [];
  constructor(private _classService: ClassService) { }

  ngOnInit(): void {
    this._classService.getAllClasses().subscribe({
      next: (data) => {
        this.allClasses = data;
      },
      error: (err) => {
        console.error('Error fetching classes:', err);
      }
    });
  }
  
}
