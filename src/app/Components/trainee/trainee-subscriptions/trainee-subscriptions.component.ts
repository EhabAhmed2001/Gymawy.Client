import { ChangeDetectorRef, Component } from '@angular/core';
import { MembershipFeatures, TraineeSubscription } from '../../../Interface/TraineeGym';
import { TraineeService } from '../../../Services/trainee.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-trainee-subscriptions',
  imports: [CommonModule, RouterModule],
  templateUrl: './trainee-subscriptions.component.html',
  styleUrl: './trainee-subscriptions.component.css'
})
export class TraineeSubscriptionsComponent {

  constructor(private _traineeService: TraineeService, private cdr: ChangeDetectorRef) { }

  subscription: TraineeSubscription |null = null;


  ngOnInit() {
    this._traineeService.GetTraineeSubscriptions().subscribe({
      next: (data) => {
        this.subscription = data;
 
      },
      error: (err) => {
        console.error('Error fetching trainee subscriptions:', err);
      }
    });
  }

  isExpired(): boolean {
    const now = new Date();
    const end = new Date(this.subscription?.membershipEndDate? this.subscription.membershipEndDate : '');
    return end.getTime() < now.getTime();
  }

}
