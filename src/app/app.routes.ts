import { Routes } from '@angular/router';
import { ClassesComponent } from './Components/classes/classes.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { TraineeLandingPageComponent } from './Components/trainee/trainee-landing-page/trainee-landing-page.component';
import { GymDetailsComponent } from './Components/trainee/gym-details/gym-details.component';
import { AddGymComponent } from './Components/add-gym/add-gym.component';
import { UploadImagesComponent } from './Components/upload-images/upload-images.component';
import { GetGymComponent } from './Components/get-gym/get-gym.component';
import { FeaturesComponent } from './Components/features/features.component';

export const routes: Routes = [
  {path:'classes/:id', component: ClassesComponent, title: "Classes"},
  {path: 'trainee-gym', component:TraineeLandingPageComponent, title: "Trainee Gym" },
  {path: 'gym/:id', component:GymDetailsComponent, title: "Gym" },
  {path:'addGym', component: AddGymComponent, title: "Add Gym"},
  {path:'image', component: UploadImagesComponent, title: "image"},
  {path:'gymDetail/:id', component: GetGymComponent, title: "Gym"},
  {path:'features/:id', component: FeaturesComponent, title: "Gym"}

];
