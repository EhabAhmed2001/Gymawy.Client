import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IMember } from '../../../Interfaces/IMember';
import { IUser } from '../../../Interfaces/IUser';
import { AuthService } from '../../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { MembersService } from '../../../Services/members.service';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';
import { ICoachInfo } from '../../../Interfaces/ICoach';
import { CoachService } from '../../../Services/coach.service';
import { TraineeService } from '../../../Services/trainee.service';
import { ITraineeInfo } from '../../../Interfaces/ITraineeInfo';
import { IOwnerInfo } from '../../../Interfaces/IOwnerInfo';
import { GymOwnerService } from '../../../Services/gym-owner.service';

@Component({
  selector: 'app-member-edit',
  imports: [CommonModule,FormsModule,TabsModule,
    TimeagoModule,PhotoEditorComponent],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event'])unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member: IMember | undefined;
  coach: ICoachInfo | undefined;
  trainee: ITraineeInfo | undefined;
   owner: IOwnerInfo | undefined;

  user: IUser | null = null;

  constructor(private _authService: AuthService,
    private _membersService: MembersService,
    private _coachService: CoachService,
    private _traineeService: TraineeService,
    private _gymOwnerService: GymOwnerService,
    private _toastrService:ToastrService) {}

ngOnInit(): void {
  this.loadMember();

  if(this.user?.role === 'Coach')
      this.loadCoachInfo();

  if(this.user?.role === 'Owner')
      this.loadOwnerInfo();

  if(this.user?.role === 'Trainee') {
      this.loadTraineeInfo();
  }


}



loadMember():void {
this.GetCurrentUser();
    if(!this.user) return;
    this._membersService.GetMemberByUsername(this.user.userName).subscribe({
      next: member => {
        this.member = member
        console.log(this.member);

      },
    });
  }
GetCurrentUser():void {
  this._authService.currentUser$.pipe(take(1)).subscribe({
    next: user => {
      this.user = user;
      console.log(this.user);

    }
    });
}

loadCoachInfo():void{
  this.GetCurrentUser();
    if(!this.user) return;
    this._coachService.getCoachByUserName(this.user.userName).subscribe({
      next: coach => {
        this.coach = coach
        console.log(this.coach);

      },
    });
}

loadTraineeInfo():void{
  this.GetCurrentUser();
    if(!this.user) return;
    this._traineeService.getTraineeByUserName(this.user.userName).subscribe({
      next: trainee => {
        this.trainee = trainee
        console.log(this.trainee);

      },
    });
}

loadOwnerInfo():void {
     this.GetCurrentUser();
    if(!this.user) return;
    this._gymOwnerService.getOwnerByUserName(this.user.userName).subscribe({
      next: owner => {
        this.owner = owner
        console.log(this.owner);

      },
    });
  }


UpdateMember():void {

  this._membersService.UpdateMember(this.editForm?.value).subscribe({
    next: _ =>{
      this._toastrService.success('Member updated successfully');
      this.editForm?.reset(this.member);

    },
  })

}



}

