import { Component } from '@angular/core';
import { DataSharedService } from '../../../Services/data-shared.service';
import { TraineeService } from '../../../Services/trainee.service';
import { GymClasses, GymDetails, GymFeatures, GymMembership } from '../../../Interface/TraineeGym';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../Services/payment.service';
import { PayFor } from '../../../Interfaces/Payment/PaymentReturn';

@Component({
  selector: 'app-gym-details',
  imports: [],
  templateUrl: './gym-details.component.html',
  styleUrl: './gym-details.component.css'
})
export class GymDetailsComponent {
  JoinFeature(id: number, cost: number, sessionCount: number) {
    this._paymentService.payFor = PayFor.Feature;
    this._paymentService.totalAmount = cost * sessionCount;
    // Navigate to payment page with feature ID
    this._paymentService.featureCount = sessionCount;
    this.router.navigate(['/payment', id])
  }


  JoinClass(id: number, cost: number) {
    this._paymentService.payFor = PayFor.Class;
    this._paymentService.totalAmount = cost;
    // Navigate to payment page with class ID
    this.router.navigate(['/payment', id]);
  }



  JoinMembership(id: number, cost: number) {
    this._paymentService.payFor = PayFor.Membership;
    this._paymentService.totalAmount = cost;
    // Navigate to payment page with membership ID
    this.router.navigate(['/payment', id]);
  }




  constructor(private router: Router, private _sharedData: DataSharedService, private _traineeService: TraineeService, private route: ActivatedRoute, private _paymentService: PaymentService) { }

  gymId: number = 0;

  gymDetails: GymDetails | null = null;
  gymMemberships: GymMembership[] = [];
  gymFeatures: GymFeatures[] = [];
  gymClasses: GymClasses[] = [];

  featureCounts: number[] = [];



  ngOnInit() {
    this.gymId = Number(this.route.snapshot.paramMap.get('id'));
    // Get gym details by ID From Shared Data
    this.gymDetails = this._sharedData.gyms.find(gym => gym.id === this.gymId) || null;

    if (!this.gymDetails) {
      // If gym details are not found in shared data, fetch from service
      this.getGymById(this.gymId);
    }
    // Fetch memberships, classes, and features for the gym
    this.getGymMemberships();
    this.getGymClasses();
    this.getGymFeatures();

  }


  increment(index: number): void {
    if (this.featureCounts[index] < 10) {
      this.featureCounts[index]++;
    }
  }

  decrement(index: number): void {
    if (this.featureCounts[index] > 1) {
      this.featureCounts[index]--;
    }
  }

  getGymById(gymId: number) {
    return this._traineeService.GetGymDetails(gymId).subscribe({
      next: (response) => {
        this.gymDetails = response;
      },
      error: (error) => {
        console.error('Error fetching gym details:', error);
      }
    });
  }

  getGymMemberships() {
    this._traineeService.GetMembershipByGymId(this.gymId).subscribe({
      next: (response) => {
        this.gymMemberships = response;

      },
      error: (error) => {
        console.error('Error fetching gym memberships:', error);
      }
    })
  }

  getGymClasses() {
    return this._traineeService.GetGymClasses(this.gymId).subscribe({
      next: (response) => {
        this.gymClasses = response;
        this.featureCounts = response.map(() => 1);
      },
      error: (error) => {
        console.error('Error fetching gym classes:', error);
      }
    });
  }


  getGymFeatures() {
    return this._traineeService.GetGymFeatures(this.gymId).subscribe({
      next: (response) => {
        this.gymFeatures = response;

      },
      error: (error) => {
        console.error('Error fetching gym features:', error);
      }
    });
  }

}
