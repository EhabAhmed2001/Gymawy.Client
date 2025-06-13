import { Component } from '@angular/core';
import { TraineeService } from '../../../Services/trainee.service';
import { TraineeCoachDetails } from '../../../Interface/TraineeGym';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trainee-coach',
  imports: [RouterLink],
  templateUrl: './trainee-coach.component.html',
  styleUrl: './trainee-coach.component.css'
})
export class TraineeCoachComponent {

  constructor(private _traineeService: TraineeService) {}

  coach : TraineeCoachDetails = {
    id: 0,
    firstName: '',
    lastName: '',
    userName: '',
    imageUrl: '',
    about: '',
    traineeCount: 0
  };
  ngOnInit(){
    this._traineeService.GetTraineeCoachDetails().subscribe({
      next: (data) => {
        this.coach = data;
      },
      error: (err) => {
        console.error('Error fetching coach details:', err);
      }
    });
  }


  onStartTraining(): void {
    console.log('Starting training with coach');
    // Add your navigation logic here
  }

  onScheduleSession(): void {
    console.log('Scheduling session with coach');
    // Add your scheduling logic here
  }

   openChat(): void {
    console.log('Opening chat with coach');
    // Add your chat opening logic here
  }
}
