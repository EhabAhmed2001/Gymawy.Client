import { Component } from '@angular/core';
import { TraineeService } from '../../../Services/trainee.service';
import { DataSharedService } from '../../../Services/data-shared.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-gyms',
  imports: [CommonModule, RouterModule],
  templateUrl: './all-gyms.component.html',
  styleUrl: './all-gyms.component.css'
})
export class AllGymsComponent {


  constructor(private _traineeService: TraineeService, public _dataShared: DataSharedService) { }


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
