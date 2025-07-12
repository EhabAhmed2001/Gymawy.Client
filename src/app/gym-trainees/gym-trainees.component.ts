import { CoachService } from '../Services/coach.service';
import { TraineeService } from '../Services/trainee.service';
import { Router } from '@angular/router';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Trainee,AssignCoachTrainee } from '../Interface/Trainee';
import { Coach } from '../Interface/Coach';
import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gym-trainees',
  imports: [
     CommonModule,
    NgFor,FormsModule
  ],
  templateUrl: './gym-trainees.component.html',
  styleUrl: './gym-trainees.component.css'
})
export class GymTraineesComponent implements OnInit{

  gymId:number=1;
  oldcoachid:number=0;
   public Trainees:Trainee[]=[]
     public Coaches:Coach[]=[]
     public AcoachTrainee:AssignCoachTrainee=
     {
      traineeId:0,
      coachId:0,
      oldCoachId:0
     }
errorMessage:string=''
  constructor(private coachserv:CoachService,private traineeserv:TraineeService,private router:ActivatedRoute,private routerNav: Router){} 

 ngOnInit(): void {
    this.gymId = +this.router.snapshot.paramMap.get('id')!;
    this.getCoaches(this.gymId);
    this.getTrainees(this.gymId);
    
  }

getTrainees(gymid:number)
{
 this.traineeserv.getTraineeByGymId(gymid).subscribe
     ({
       next:(data: Trainee[]) => {
                       this.Trainees = data;
                       console.log(this.Trainees);
       
                },
 
         error: (err) => {
         console.error('Error loading classes:', err);
         this.errorMessage = 'Failed to load classes. Please try again later.';
       }
     })
}
getCoaches(gymid:number)
{
 this.coachserv.getCoachesBygym(gymid).subscribe
     ({
       next:(data: Coach[]) => {
                       this.Coaches = data;
                       console.log(this.Coaches);
       
                },
 
         error: (err) => {
         console.error('Error loading classes:', err);
         this.errorMessage = 'Failed to load classes. Please try again later.';
       }
     })
}

takeoldvalue(id:number)
{
  this.oldcoachid=id;
  console.log(this.oldcoachid);
}
AssignCoach(traineeid:number,coachid:number)
{
console.log(coachid);
 this.AcoachTrainee={
  traineeId:+traineeid,
  coachId:+coachid,
  oldCoachId:+this.oldcoachid
 }
 console.log(this.AcoachTrainee);
 this.traineeserv.AssignCoachtoTrainee(this.AcoachTrainee).subscribe({
      next: (response) => {
        console.log(' successfully :Assigned Coach ', response.message);
        
        window.location.reload();
      },
      error: (err) => {
        console.error('Error Assign Coach:', err);
        alert(err.error?.error || 'Something went wrong!');
      }
    });

}


}
