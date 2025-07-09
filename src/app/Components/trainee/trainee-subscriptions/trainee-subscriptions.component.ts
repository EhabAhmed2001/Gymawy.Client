import { ChangeDetectorRef, Component } from '@angular/core';
import { MembershipFeatures, TraineeSubscription } from '../../../Interface/TraineeGym';
import { TraineeService } from '../../../Services/trainee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trainee-subscriptions',
  imports: [CommonModule],
  templateUrl: './trainee-subscriptions.component.html',
  styleUrl: './trainee-subscriptions.component.css'
})
export class TraineeSubscriptionsComponent {

  constructor(private _traineeService: TraineeService, private cdr: ChangeDetectorRef) { }

  subscription: TraineeSubscription = {
    membershipStartDate: new Date(),
    membershipEndDate: new Date(),
    gymData: {
      id: 0,
      gymType: '',
      logo: '',
      name: '',
      phone: '',
      description: '',
      address: {
        street: '',
        city: '',
        country: ''
      }
    },
    membership: {
      id: 0,
      name: '',
      description: '',
      cost: 0,
      duration: 0,
      count: 0,
      features: []
    },
    features: [],
    class: []
  };


  ngOnInit() {
    this._traineeService.GetTraineeSubscriptions().subscribe({
      next: (data) => {
        this.subscription = data;
        console.log(`Classes Data:`, data.class);
 
      },
      error: (err) => {
        console.error('Error fetching trainee subscriptions:', err);
      }
    });
  }

  isExpired(): boolean {
    const now = new Date();
    const end = new Date(this.subscription.membershipEndDate);
    return end.getTime() < now.getTime();
  }

}
