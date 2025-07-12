import { Routes } from '@angular/router';
import { ClassesComponent } from './Components/classes/classes.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { MembershipComponent } from './Components/membership/membership.component';
import { GymMemberShipsComponent } from './Components/gym-member-ships/gym-member-ships.component';
import { EditMembershipComponent } from './Components/edit-membership/edit-membership.component';
import { GymTraineesComponent } from './gym-trainees/gym-trainees.component';

export const routes: Routes = [
  {path:'classes/:id', component: ClassesComponent, title: "Classes"},
    {path:'createmembership/:id', component:MembershipComponent , title: "Createmembership"},
    {path:'memberships/:id', component:GymMemberShipsComponent , title: "GetMemberShips"},
    {path:'EditMembership/:id', component:EditMembershipComponent , title: "Edit MemberShip"},
    {path:'trainess/:id', component:GymTraineesComponent , title: "Trainees"}


];
