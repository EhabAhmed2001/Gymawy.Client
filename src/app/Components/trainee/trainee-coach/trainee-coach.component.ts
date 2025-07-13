import { Component } from '@angular/core';
import { TraineeService } from '../../../Services/trainee.service';
import { TraineeCoachDetails } from '../../../Interface/TraineeGym';
import { RouterLink ,RouterModule} from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { IUser } from '../../../Interfaces/IUser';

@Component({
  selector: 'app-trainee-coach',
  imports: [RouterLink, RouterModule,CommonModule],
  templateUrl: './trainee-coach.component.html',
  styleUrl: './trainee-coach.component.css'
})
export class TraineeCoachComponent {

user!:IUser;
  constructor(private _traineeService: TraineeService ,
     private _authService: AuthService) {}

  coach : TraineeCoachDetails | null = null;

  ngOnInit(){
    this._traineeService.GetTraineeCoachDetails().subscribe({
      next: (data) => {
        this.coach = data;
      },
      error: (err) => {
        console.error('Error fetching coach details:', err);
      }
    });
    this.IsCoach();

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

  IsCoach():void{
    this._authService.currentUser$.pipe(take(1)).subscribe({
      next : user => {
        if(user) {
          this.user = user;
        }
      }
    })
  }


}
