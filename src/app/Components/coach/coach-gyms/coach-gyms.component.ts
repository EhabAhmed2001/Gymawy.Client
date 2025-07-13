import { Component } from '@angular/core';
import { TraineeService } from '../../../Services/trainee.service';
import { DataSharedService } from '../../../Services/data-shared.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoachService } from '../../../Services/coach.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JoinGymRequest } from '../../../Interface/Coach/JoinGymReques';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-coach-gyms',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './coach-gyms.component.html',
  styleUrls: ['./coach-gyms.component.css'],
})
export class CoachGymsComponent {
  requestForm: FormGroup;
  showRequestModal = false;
  selectedGymId: number | null = null;
  requestStatus: boolean = false;

  constructor(
    private _traineeService: TraineeService,
    public _dataShared: DataSharedService,
    private _coachService: CoachService,
    private _toastrService : ToastrService,
    private fb: FormBuilder
  ) {
    this.requestForm = this.fb.group({
      workDayDtos: this.fb.array([this.createWorkDayFormGroup()]),
    });
  }

  ngOnInit() {
    this._traineeService.GetAllGyms().subscribe({
      next: (response) => {
        this._dataShared.gyms = response;
      },
      error: (error) => {
        console.error('Error fetching gyms:', error);
      },
    });
  }

  get workDayDtos(): FormArray {
    return this.requestForm.get('workDayDtos') as FormArray;
  }

  createWorkDayFormGroup(): FormGroup {
    return this.fb.group({
      day: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
  }

  // Helper method to convert day name to number
  private convertDayToNumber(dayName: string): number {
    const dayMap: { [key: string]: number } = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    return dayMap[dayName] ?? 0;
  }

  addWorkDay() {
    this.workDayDtos.push(this.createWorkDayFormGroup());
  }

  removeWorkDay(index: number) {
    this.workDayDtos.removeAt(index);
  }

  openRequestModal(gymId: number) {
    this.selectedGymId = gymId;
    this.showRequestModal = true;
    // Reset form when opening modal
    this.requestForm.reset();
    this.workDayDtos.clear();
    this.addWorkDay();
  }

  closeRequestModal() {
    this.showRequestModal = false;
  }

  submitRequest() {
    if (this.requestForm.valid && this.selectedGymId !== null) {
      // Create the request object matching the exact backend structure
      const requestData = {
        gymId: this.selectedGymId,
        workDays: this.workDayDtos.controls.map((control) => ({
          day: this.convertDayToNumber(control.get('day')?.value),
          start: this.formatTime(control.get('start')?.value),
          end: this.formatTime(control.get('end')?.value),
        })),
      };

      console.log('Sending request:', JSON.stringify(requestData, null, 2)); // For debugging

      this._coachService.requestToJoinGym(requestData).subscribe({
        next: (response) => {
          this.requestStatus = true;
          this._toastrService.success('Request sent successfully!');
          this.closeRequestModal();
        },
        error: (error) => {
          console.error('Error sending request:', error);
          // More detailed error handling
          if (error.error && error.error.errors) {
            console.error('Validation errors:', error.error.errors);
          }
          if (error.error && error.error.title) {
            console.error('Error title:', error.error.title);
          }

          this._toastrService.error(
            'Failed to send request. Please check all fields are properly filled.'
          );
        },
      });
    } else {
      console.log('Form is invalid:', this.requestForm.errors);
      console.log('Form values:', this.requestForm.value);
      // Check individual form controls for validation errors
      this.workDayDtos.controls.forEach((control, index) => {
        if (control.invalid) {
          console.log(`WorkDay ${index} errors:`, control.errors);
        }
      });
    }
  }

  // Helper method to format time values for TimeOnly backend
  private formatTime(timeString: string): string {
    if (!timeString) return '';

    // Convert HH:MM to HH:MM:SS format for TimeOnly compatibility
    if (timeString.split(':').length === 2) {
      return timeString + ':00';
    }

    // If already in HH:MM:SS format, return as-is
    return timeString;
  }
}
