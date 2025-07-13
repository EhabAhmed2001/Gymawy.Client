import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GymService } from '../../Services/gym.service';
import { Features } from '../../Interface/Gym/Membership';
import { MemberShip } from '../../Interface/Gym/Membership';

import { FormControl, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './membership.component.html',
  styleUrl: './membership.component.css'
})
export class MembershipComponent implements OnInit {
  gymId: number = 1;
  errorMessage: string = '';
  public GymFeatures: Features[] = [];

  Membershipdata = new FormGroup({
    memberName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    cost: new FormControl(0, Validators.required),
    duration: new FormControl(0, Validators.required),
    gymFeaturesId: new FormArray([], Validators.required)
  });

  onFeatureToggle(id: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const gymFeaturesArray = this.Membershipdata.get('gymFeaturesId') as FormArray;

    if (checkbox.checked) {
      const exists = gymFeaturesArray.controls.some(ctrl => ctrl.value === id);
      if (!exists) {
        gymFeaturesArray.push(new FormControl(id));
      }
    } else {
      const index = gymFeaturesArray.controls.findIndex(ctrl => ctrl.value === id);
      if (index > -1) {
        gymFeaturesArray.removeAt(index);
      }
    }
    
    console.log('Selected features:', gymFeaturesArray.value);
  }

  
  isFeatureSelected(featureId: number): boolean {
    const gymFeaturesArray = this.Membershipdata.get('gymFeaturesId') as FormArray;
    return gymFeaturesArray.controls.some(ctrl => ctrl.value === featureId);
  }

  SendMembership() {
    this.Membershipdata.markAllAsTouched();
    
    if (this.Membershipdata.invalid) {
      console.log('Form is invalid');
      return;
    }

    const selectedFeatures = (this.Membershipdata.get('gymFeaturesId') as FormArray).value;
    
    if (selectedFeatures.length === 0) {
      alert('Please select at least one feature');
      return;
    }

    const Data: MemberShip = {
      name: this.Membershipdata.get('memberName')?.value!,
      description: this.Membershipdata.get('description')?.value!,
      cost: this.Membershipdata.get('cost')?.value!,
      duration: this.Membershipdata.get('duration')?.value!,
      count: 0,
      gymId: this.gymId,
      gymFeaturesId: selectedFeatures
    };

    console.log('Sending membership data:', Data);

    this.gymserv.createMemberShip(Data).subscribe({
      next: (response) => {
        console.log('Membership created:', response.message);
        alert(response.message);
        this.resetForm();
         this.routerNav.navigate(['/gym-owner/memberships',this.gymId]); 
      },
      error: (err) => {
        console.error('Error creating membership:', err);
        alert(err.error?.error || 'Something went wrong!');
      }
    });
  }

  resetForm() {
    this.Membershipdata.reset({
      memberName: '',
      description: '',
      cost: 0,
      duration: 0
    });
    
    const gymFeaturesArray = this.Membershipdata.get('gymFeaturesId') as FormArray;
    gymFeaturesArray.clear();
  }

  get membervalid() {
    return this.Membershipdata.invalid;
  }

  constructor(
    private gymserv: GymService,
    private router: ActivatedRoute,
    private routerNav: Router
  ) {}

  ngOnInit(): void {
    this.gymId = +this.router.snapshot.paramMap.get('id')!;
    this.getFeatures();
  }

  getFeatures() {
    this.gymserv.getGym2FeaturesByGymID(this.gymId).subscribe({
      next: (data: Features[]) => {
        this.GymFeatures = data;
        console.log('Features loaded:', this.GymFeatures);
      },
      error: (err) => {
        console.error('Error loading features:', err);
        this.errorMessage = 'Failed to load features. Please try again later.';
      }
    });
  }

  get gymFeaturesFormArray(): FormArray {
    return this.Membershipdata.get('gymFeaturesId') as FormArray;
  }

  get isFormValid(): boolean {
    return this.Membershipdata.valid && this.gymFeaturesFormArray.length > 0;
  }

  getFieldError(fieldName: string): string {
    const field = this.Membershipdata.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
    }
    return '';
  }
}