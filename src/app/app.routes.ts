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
import { RegisterComponent } from './Components/Auth/register/register.component';
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
import { GymDetailsAdminComponent } from './Components/gym-details-admin/gym-details-admin.component';
import { GetPendingGymsComponent } from './Components/get-pending-gyms/get-pending-gyms.component';
import { AdminLayoutComponent } from './Components/admin-layout/admin-layout.component';
import { MembershipComponent } from './Components/membership/membership.component';
import { GymMemberShipsComponent } from './Components/gym-member-ships/gym-member-ships.component';
import { EditMembershipComponent } from './Components/edit-membership/edit-membership.component';
import { GymTraineesComponent } from './gym-trainees/gym-trainees.component';

import { WelcomeAsComponent } from './Components/Auth/welcome-as/welcome-as.component';
import { LoginComponent } from './Components/Auth/login/login.component';
import { RegisterAsCoachComponent } from './Components/Auth/register-as-coach/register-as-coach.component';
import { RegisterAsGymOwnerComponent } from './Components/Auth/register-as-gym-owner/register-as-gym-owner.component';
import { RoomComponent } from './Components/coach/room/room.component';
import { InbodyComponent } from './Components/trainee/inbody/inbody.component';
import { GymOwnerProfileComponent } from './Components/gym-owner-profile/gym-owner-profile.component';
import { ChatbotComponent } from './Components/chat/chatbot/chatbot.component';


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
        {path:'room/:roomId', component:RoomComponent, title:'room'},
        {path:'inbody', component:InbodyComponent, title:'Inbody Analyzer'},
        {path:'chat-bot', component:ChatbotComponent, title:'chat-bot'},

      ]
    },


    {//path: 'gym-owner/:id',
      path: 'gym-owner',
    component: GymOwnerComponent,
    canActivate:[authGuard],
    children: [
      {path:'gym/:gymId/class', component: ClassesComponent, title: "Classes"},
      {path:'gym/:gymId/class/:classId/trainees', component: ClassTraineesComponent, title: "Joined Trainees"},
      {path:'addGym', component: AddGymComponent, title: "Add Gym"},
      {path:'gymDetail/:id', component: GetGymComponent, title: "Edit Gym Info"},
      {path:'features/:id', component: FeaturesComponent, title: "Gym Features"},
      {path:'GymPendingCoach/:gymId', component: GymPendingCoachComponent, title: "Pending Coach"},
      {path:'createmembership/:id', component:MembershipComponent , title: "Createmembership"},
      {path:'memberships/:id', component:GymMemberShipsComponent , title: "GetMemberShips"},
      {path:'EditMembership/:id', component:EditMembershipComponent , title: "Edit MemberShip"},
      {path:'profile', component:GymOwnerProfileComponent , title: "Owner Profile"}
    ]},
    {
      path:'admin',component:AdminLayoutComponent,
      children:[
        {path:"" , component:AdminDashboardComponent, title:'Admin Dashboard' },
        {path:'PendingGyms', component: GetPendingGymsComponent, title: "Pending Gyms"}
      ]
    },
      { path: '', component: AuthLayoutComponent, children: [
      { path: '', redirectTo: 'register', pathMatch: 'full' },
      { path: 'register', component: WelcomeAsComponent, title: "register" },
      { path: 'login', component: LoginComponent, title: "login" },
      { path: 'register/trainee', component: RegisterComponent, title: "register" },
      { path: 'register/coach', component: RegisterAsCoachComponent, title: "register" },
      { path: 'register/admin', component: RegisterAsGymOwnerComponent, title: "register" },
    ]},



    {path:'image', component: UploadImagesComponent, title: "image"},
    {path:'admin/dashboard', component:AdminDashboardComponent, title: "Admin Dashboard"},
    {path:'PendingGymDetails/:id', component: GymDetailsAdminComponent, title: "Gym Detail"},
    //{path:'PendingGyms', component: GetPendingGymsComponent, title: "Pending Gyms"}
    {path:'classes/:id', component: ClassesComponent, title: "Classes"},
    {path:'trainess/:id', component:GymTraineesComponent , title: "Trainees"},
    { path: 'notFound', component: NotFoundComponent, title: "nofound" },

];
