import { Routes } from '@angular/router';
import { ClassesComponent } from './Components/classes/classes.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { TraineeLandingPageComponent } from './Components/trainee/trainee-landing-page/trainee-landing-page.component';
import { GymDetailsComponent } from './Components/trainee/gym-details/gym-details.component';
import { AddGymComponent } from './Components/add-gym/add-gym.component';

export const routes: Routes = [
  {path:'classes/:id', component: ClassesComponent, title: "Classes"},
  {path: 'trainee-gym', component:TraineeLandingPageComponent, title: "Trainee Gym" },
  {path: 'gym/:id', component:GymDetailsComponent, title: "Gym" },
  {path:'gym/add', component: AddGymComponent, title: "Add Gym"}
];
