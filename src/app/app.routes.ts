import { Routes } from '@angular/router';
import { ClassesComponent } from './Components/classes/classes.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { AddGymComponent } from './Components/add-gym/add-gym.component';

export const routes: Routes = [
  {path:'classes/:id', component: ClassesComponent, title: "Classes"},
  {path:'gym/add', component: AddGymComponent, title: "Add Gym"}

];
