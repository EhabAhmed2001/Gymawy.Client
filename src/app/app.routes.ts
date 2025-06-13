import { Routes } from '@angular/router';
import { ClassesComponent } from './Components/classes/classes.component';
import { ClassTraineesComponent } from './Components/class-trainees/class-trainees.component';

export const routes: Routes = [
  {path:'gym/:gymId/class', component: ClassesComponent, title: "Classes"},
  {path:'gym/:gymId/class/:classId/trainees', component: ClassTraineesComponent, title: "Joined Trainees"} 
];
