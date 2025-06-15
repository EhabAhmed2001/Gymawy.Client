import { Routes } from '@angular/router';
import { ClassesComponent } from './Components/classes/classes.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { TraineeLandingPageComponent } from './Components/trainee/trainee-landing-page/trainee-landing-page.component';
import { GymDetailsComponent } from './Components/trainee/gym-details/gym-details.component';
import { TraineeComponent } from './Layout/trainee/trainee.component';
import { TraineeCoachComponent } from './Components/trainee/trainee-coach/trainee-coach.component';
import { TraineeSubscriptionsComponent } from './Components/trainee/trainee-subscriptions/trainee-subscriptions.component';
import { MemberDetailsComponent } from './Components/members/member-details/member-details.component';
import { memberDetailsResolver } from './resolver/member-details.resolver';
import { MemberEditComponent } from './Components/members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './guard/prevent-unsaved-changes.guard';
import { RegisterComponent } from './Components/register/register.component';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import { authGuard } from './guard/auth.guard';
import { AuthLayoutComponent } from './Layout/auth-layout/auth-layout.component';
import { ClassTraineesComponent } from './Components/class-trainees/class-trainees.component';
import { AddGymComponent } from './Components/add-gym/add-gym.component';

export const routes: Routes = [
  {
    path: '',
    component: TraineeComponent,
    canActivate:[authGuard],
    children: [
      { path: '', redirectTo: 'trainee-gym', pathMatch: 'full' },
      { path: 'trainee-gym', component: TraineeLandingPageComponent, title: "Trainee Gym" },
      { path: 'gym/:id', component: GymDetailsComponent, title: "Gym" },
      { path: 'coach', component: TraineeCoachComponent, title: "Coach" },
      { path: 'subscriptions', component: TraineeSubscriptionsComponent, title: "Subscriptions" },
      { path: 'members/:username',component: MemberDetailsComponent, resolve: { member: memberDetailsResolver } },
      { path: 'member/edit',canDeactivate:[preventUnsavedChangesGuard],component: MemberEditComponent, title: "Edit Member" },
      { path: 'notFound', component: NotFoundComponent, title: "nofound" },
      { path: 'home', component: HomeComponent, title: "home" },
    ]
  },


  { path: '', component: AuthLayoutComponent, children: [
      { path: 'login', component: LoginComponent, title: "login" },
      { path: 'register/trainee', component: RegisterComponent, title: "register" },
    ]},
    {path:'gym/:gymId/class', component: ClassesComponent, title: "Classes"},
    {path:'gym/:gymId/class/:classId/trainees', component: ClassTraineesComponent, title: "Joined Trainees"},
    {path:'gym', component:AddGymComponent}

];
