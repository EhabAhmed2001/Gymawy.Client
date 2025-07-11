import { Routes } from '@angular/router';
import { ClassesComponent } from './Components/classes/classes.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { TraineeLandingPageComponent } from './Components/trainee/trainee-landing-page/trainee-landing-page.component';
import { GymDetailsComponent } from './Components/trainee/gym-details/gym-details.component';
import { TraineeComponent } from './Layout/trainee/trainee.component';
import { TraineeCoachComponent } from './Components/trainee/trainee-coach/trainee-coach.component';
import { TraineeSubscriptionsComponent } from './Components/trainee/trainee-subscriptions/trainee-subscriptions.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { MemberDetailsComponent } from './Components/members/member-details/member-details.component';
import { memberDetailsResolver } from './resolver/member-details.resolver';
import { MemberEditComponent } from './Components/members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './guard/prevent-unsaved-changes.guard';
import { RegisterComponent } from './Components/register/register.component';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import { authGuard } from './guard/auth.guard';
import { AuthLayoutComponent } from './Layout/auth-layout/auth-layout.component';
import { CoachDashboardComponent } from './Components/coach/coach-dashboard/coach-dashboard.component';
import { ClassTraineesComponent } from './Components/class-trainees/class-trainees.component';
import { AddGymComponent } from './Components/add-gym/add-gym.component';
import { UploadImagesComponent } from './Components/upload-images/upload-images.component';
import { GetGymComponent } from './Components/get-gym/get-gym.component';
import { FeaturesComponent } from './Components/features/features.component';
import { GymPendingCoachComponent } from './Components/gym-pending-coach/gym-pending-coach.component';
import { GymOwnerComponent } from './Components/gym-owner/gym-owner.component';
import { TraineeDetailsComponent } from './Components/coach/trainee-details/trainee-details.component';

import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';


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
      {path: 'coach/:coachId', component: CoachDashboardComponent, title: "Dashboard"},
      {path: 'coach/traineeDetails/:traineeId', component: TraineeDetailsComponent, title: "Trainee Details"},
      { path: 'subscriptions', component: TraineeSubscriptionsComponent, title: "Subscriptions" },
      { path: 'payment/:id', component: PaymentComponent, title: "Payment" },
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

    {path: 'gym-owner/:id',
    component: GymOwnerComponent,
    children: [
      {path:'gym/:gymId/class', component: ClassesComponent, title: "Classes"},
      {path:'gym/:gymId/class/:classId/trainees', component: ClassTraineesComponent, title: "Joined Trainees"},
      {path:'addGym', component: AddGymComponent, title: "Add Gym"},
      {path:'gymDetail/:id', component: GetGymComponent, title: "Edit Gym Info"},
      {path:'features/:id', component: FeaturesComponent, title: "Gym Features"},
      {path:'GymPendingCoach/:gymId', component: GymPendingCoachComponent, title: "Pending Coach"}
    ]},
    {path:'image', component: UploadImagesComponent, title: "image"},
    {path:'gym', component:AddGymComponent},
    {path:'admin/dashboard', component:AdminDashboardComponent, title: "Admin Dashboard"}
];
