import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TraineeService } from '../../../Services/trainee.service';
import { EditTraineeProfileDto, TraineeInfo } from '../../../Interface/TraineeGym';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})

export class EditProfileComponent {

  traineeData!: TraineeInfo
  profileForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  isLoading = false;
  errorMessage: string | null = null;



  constructor(private _traineeService: TraineeService, private location: Location, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfileData();
  }

  loadProfileData() {
    this._traineeService.GetTraineeData().subscribe({
      next: (response) => {
        this.traineeData = response;
        this.patchFormValues();
      },
      error: (error) => {
        console.error('No Current User:', error);
      }
    });
  }

  initializeForm(): void {
    this.profileForm = new FormGroup({
      personalInfo: new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        dateOfBirth: new FormControl(null),
        phoneNumber: new FormControl(''),
        reasonForJoining: new FormControl(''),
        weight: new FormControl(null, [Validators.min(30), Validators.max(300)])
      }),
      address: new FormGroup({
        street: new FormControl(''),
        city: new FormControl(''),
        country: new FormControl('')
      }),
      image: new FormControl(null)
    });
  }

  patchFormValues(): void {
    console.log('Patching form with:');
    console.log(this.traineeData);
    this.profileForm.patchValue({
      personalInfo: {
        firstName: this.traineeData.firstName,
        lastName: this.traineeData.lastName,
        dateOfBirth: this.traineeData.dateOfBirth,
        phoneNumber: this.traineeData.phoneNumber,
        reasonForJoining: this.traineeData.reasonForJoining,
        weight: this.traineeData.weight
      },
      address: {
        street: this.traineeData.address.street,
        city: this.traineeData.address.city,
        country: this.traineeData.address.country
      }
    });
    this.imagePreview = this.traineeData.imageUrl;
  }

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileForm.patchValue({ image: file });
      this.profileForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  prepareUpdatePayload(): EditTraineeProfileDto {
    const formValue = this.profileForm.value;
    return {
      firstName: formValue.personalInfo.firstName,
      lastName: formValue.personalInfo.lastName,
      address: {
        street: formValue.address.street,
        city: formValue.address.city,
        country: formValue.address.country
      },
      image: formValue.image,
      dateOfBirth: formValue.personalInfo.dateOfBirth,
      phoneNumber: formValue.personalInfo.phoneNumber,
      reasonForJoining: formValue.personalInfo.reasonForJoining,
      weight: formValue.personalInfo.weight
    };
  }

  onCancel(): void {
    this.location.back();
  }

  // onSubmit(): void {
  // if (this.profileForm.valid) {
  //   const payload = this.prepareUpdatePayload();
  //   this._traineeService.updateProfile(payload).subscribe({
  //     next: (response) => {
  //       console.log('Profile updated successfully', response);
  //       // Handle success (e.g., show toast, navigate, etc.)
  //     },
  //     error: (error) => {
  //       console.error('Error updating profile:', error);
  //     }
  //   });
  // }
  // }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const formData = this.prepareUpdatePayload();

    this._traineeService.updateProfile(formData)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response);
          // reload the page
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        },
        error: (error) => {
          console.error('Update failed', error);
          this.errorMessage = error.error?.message || 'Failed to update profile';
        }
      });
  }

}
