import { Routes } from '@angular/router';
import { ClassesComponent } from './Components/classes/classes.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';

export const routes: Routes = [
  {path:'classes/:id', component: ClassesComponent, title: "Classes"}
];
