import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TraineeService } from '../../../Services/trainee.service';
import { RouterModule } from '@angular/router';
import { DataSharedService } from '../../../Services/data-shared.service';

@Component({
  selector: 'app-trainee-landing-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './trainee-landing-page.component.html',
  styleUrl: './trainee-landing-page.component.css'
})
export class TraineeLandingPageComponent {


  constructor(private _traineeService : TraineeService, public _dataShared : DataSharedService) { }

  
  ngOnInit() {
    this._traineeService.GetAllGyms().subscribe({
      next: (response) => {
        this._dataShared.gyms = response;
      },
      error: (error) => {
        console.error('Error fetching gyms:', error);
      }
    });
  }

}
