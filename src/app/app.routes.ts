import { Routes } from '@angular/router';
import { ClassesComponent } from './Components/classes/classes.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { TraineeLandingPageComponent } from './Components/trainee/trainee-landing-page/trainee-landing-page.component';
import { GymDetailsComponent } from './Components/trainee/gym-details/gym-details.component';
import { TraineeComponent } from './Layout/trainee/trainee.component';
import { TraineeCoachComponent } from './Components/trainee/trainee-coach/trainee-coach.component';
import { TraineeSubscriptionsComponent } from './Components/trainee/trainee-subscriptions/trainee-subscriptions.component';
import { ClassesComponent } from './Components/classes/classes.component';

export const routes: Routes = [
  {
    path: '',
    component: TraineeComponent,
    children: [
      { path: '', redirectTo: 'trainee-gym', pathMatch: 'full' },
      { path: 'trainee-gym', component: TraineeLandingPageComponent, title: "Trainee Gym" },
      { path: 'gym/:id', component: GymDetailsComponent, title: "Gym" },
      { path: 'coach', component: TraineeCoachComponent, title: "Coach" },
      { path: 'subscriptions', component: TraineeSubscriptionsComponent, title: "Subscriptions" },
    ]
  },
  {path:'gym/:gymId/class', component: ClassesComponent, title: "Classes"},
  {path:'gym/:gymId/class/:classId/trainees', component: ClassTraineesComponent, title: "Joined Trainees"}

];
