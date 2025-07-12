import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ExerciseScheduleService } from '../../../Services/exercise-schedule.service';
import {
  CreateExerciseScheduleRequest,
  UpdateExerciseScheduleRequest,
  ExerciseScheduleResponse,
} from '../../../Interface/Coach/exercise-schedule';
import { Muscle, Exercise } from '../../../Interface/Coach/muscle';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.css'],
})
export class ExerciseFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private exerciseScheduleService = inject(ExerciseScheduleService);
  private destroy$ = new Subject<void>();

  @Input() traineeId!: number;
  @Input() scheduleId?: number;
  @Input() isEditMode = false;
  @Output() formSubmitted = new EventEmitter<ExerciseScheduleResponse>();
  @Output() formCancelled = new EventEmitter<void>();

  exerciseForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  validationErrors: string[] = [];

  muscles: Muscle[] = [];
  filteredExercises: Exercise[] = [];
  selectedMuscleId: number | null = null;
  isLoadingMuscles = false;

  ngOnInit(): void {
    this.initializeForm();
    this.loadMuscles(); // Load muscles first

    // Add form change listener for real-time validation
    this.exerciseForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // Only validate if form has been touched/submitted before
      if (this.exerciseForm.dirty) {
        this.validateFormData();
      }
    });

    if (this.isEditMode && this.scheduleId) {
      // Wait a brief moment to ensure muscles are loaded
      setTimeout(() => {
        this.loadScheduleData();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.exerciseForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      scheduledExercises: this.fb.array([this.createExerciseFormGroup()]),
    });
  }

  private createExerciseFormGroup(exercise?: any): FormGroup {
    return this.fb.group({
      id: [exercise?.id || null],
      exerciseId: [exercise?.exerciseId || '', Validators.required],
      muscleId: [exercise?.muscleId || '', Validators.required],
      day: [
        exercise?.day ? this.formatDateForInput(exercise.day) : '',
        Validators.required,
      ],
    });
  }

  private loadScheduleData(): void {
    if (!this.scheduleId) return;

    this.exerciseScheduleService
      .getExerciseSchedule(this.scheduleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (schedule) => {
          this.populateForm(schedule);
        },
        error: (error) => {
          console.error('Error loading exercise schedule:', error);
          this.errorMessage = 'Failed to load schedule data. Please try again.';
        },
      });
  }

  loadMuscles(): void {
    this.isLoadingMuscles = true;
    this.exerciseScheduleService
      .getAllMusclesWithExercises()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (muscles) => {
          this.muscles = muscles;
          this.isLoadingMuscles = false;
        },
        error: (error) => {
          console.error('Error loading muscles:', error);
          this.isLoadingMuscles = false;
        },
      });
  }

  onMuscleSelect(event: Event, exerciseIndex: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const muscleId = Number(selectElement.value);

    if (!muscleId) {
      this.filteredExercises = [];
      return;
    }

    const muscle = this.muscles.find((m) => m.id === muscleId);
    if (muscle) {
      const exerciseGroup = this.exercisesFormArray.at(exerciseIndex);
      exerciseGroup.get('muscleId')?.setValue(muscleId);
      exerciseGroup.get('exerciseId')?.setValue(''); // Reset exercise selection
    }
  }

  private populateForm(schedule: ExerciseScheduleResponse): void {
    // Set the date fields
    this.exerciseForm.patchValue({
      startDate: this.formatDateForInput(schedule.startDate),
      endDate: this.formatDateForInput(schedule.endDate),
    });

    // Clear existing exercises
    this.exercisesFormArray.clear();

    // Ensure muscles are loaded before populating
    if (this.muscles && this.muscles.length > 0) {
      this.populateExercisesWithMuscles(schedule.scheduledExercises);
    } else {
      // Load muscles and then populate
      this.exerciseScheduleService
        .getAllMusclesWithExercises()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (muscles) => {
            this.muscles = muscles;
            this.populateExercisesWithMuscles(schedule.scheduledExercises);
          },
          error: (error) => {
            console.error('Error loading muscles:', error);
          },
        });
    }
  }

  private populateExercisesWithMuscles(scheduledExercises: any[]): void {
    scheduledExercises.forEach((exercise) => {
      // Find the muscle that contains this exercise
      const muscle = this.muscles.find((m) =>
        m.exercises.some((e) => e.id === exercise.exerciseId)
      );

      if (muscle) {
        // Create form group with proper values
        const exerciseGroup = this.fb.group({
          id: [exercise.id],
          exerciseId: [exercise.exerciseId, Validators.required],
          muscleId: [muscle.id, Validators.required],
          day: [this.formatDateForInput(exercise.day), Validators.required],
        });

        this.exercisesFormArray.push(exerciseGroup);
      } else {
        console.warn(
          `Could not find muscle for exercise ID: ${exercise.exerciseId}`
        );
        // Still create the form group but without muscle selection
        const exerciseGroup = this.fb.group({
          id: [exercise.id],
          exerciseId: [exercise.exerciseId, Validators.required],
          muscleId: ['', Validators.required],
          day: [this.formatDateForInput(exercise.day), Validators.required],
        });

        this.exercisesFormArray.push(exerciseGroup);
      }
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  get exercisesFormArray(): FormArray {
    return this.exerciseForm.get('scheduledExercises') as FormArray;
  }

  addExercise(): void {
    this.exercisesFormArray.push(this.createExerciseFormGroup());
  }

  removeExercise(index: number): void {
    if (this.exercisesFormArray.length > 1) {
      this.exercisesFormArray.removeAt(index);
    }
  }

  getFieldError(fieldName: string): boolean {
    const field = this.exerciseForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getExerciseFieldError(exerciseIndex: number, fieldName: string): boolean {
    const exercise = this.exercisesFormArray.at(exerciseIndex);
    const field = exercise.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private validateFormData(): void {
    this.validationErrors = []; // Clear previous errors

    const formValue = this.exerciseForm.value;

    // Prepare the data for validation
    const scheduleData = this.isEditMode
      ? this.prepareUpdateData(formValue)
      : this.prepareCreateData(formValue);

    // Get validation errors from service
    this.validationErrors = this.exerciseScheduleService.validateExerciseScheduleData(scheduleData);
  }

  onSubmit(): void {
    if (this.isSubmitting) return;

    // Always validate first, regardless of form.valid status
    this.validateFormData();

    // If there are validation errors, don't proceed
    if (this.validationErrors.length > 0) {
      this.errorMessage = 'Please fix the validation errors above.';
      return;
    }

    // If Angular form is invalid, don't proceed
    if (!this.exerciseForm.valid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue = this.exerciseForm.value;

    const operation = this.isEditMode && this.scheduleId
      ? this.updateScheduleOperation(formValue)
      : this.createScheduleOperation(formValue);

    operation.pipe(takeUntil(this.destroy$)).subscribe({
      next: (message: string) => {
        this.isSubmitting = false;
        this.validationErrors = []; // Clear validation errors on success
        this.fetchCurrentSchedule();
      },
      error: (error) => {
        console.error('Operation failed:', error);
        this.errorMessage = error.message || 'An error occurred. Please try again.';
        this.isSubmitting = false;
      },
    });
  }

  private prepareCreateData(formValue: any): CreateExerciseScheduleRequest {
    return {
      startDate: new Date(formValue.startDate),
      endDate: new Date(formValue.endDate),
      scheduledExercises: formValue.scheduledExercises.map((exercise: any) => ({
        exerciseId: Number(exercise.exerciseId),
        day: new Date(exercise.day),
      })),
    };
  }

  private prepareUpdateData(formValue: any): UpdateExerciseScheduleRequest {
    return {
      startDate: new Date(formValue.startDate),
      endDate: new Date(formValue.endDate),
      scheduledExercises: formValue.scheduledExercises.map((exercise: any) => ({
        id: exercise.id,
        exerciseId: Number(exercise.exerciseId),
        day: new Date(exercise.day),
      })),
    };
  }

  private fetchCurrentSchedule(): void {
    if (this.isEditMode && this.scheduleId) {
      // For edit mode, get the updated schedule
      this.exerciseScheduleService
        .getExerciseSchedule(this.scheduleId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (schedule: ExerciseScheduleResponse) => {
            this.formSubmitted.emit(schedule);
          },
          error: (error) => {
            console.error('Error fetching updated schedule:', error);
            this.errorMessage = 'Schedule updated but failed to load details.';
          },
        });
    } else {
      // For create mode, get the trainee's current schedule
      this.exerciseScheduleService
        .getExerciseScheduleByTrainee(this.traineeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (schedule: ExerciseScheduleResponse) => {
            this.formSubmitted.emit(schedule);
          },
          error: (error) => {
            console.error('Error fetching created schedule:', error);
            this.errorMessage = 'Schedule created but failed to load details.';
          },
        });
    }
  }

  private createScheduleOperation(formValue: any) {
    const createData: CreateExerciseScheduleRequest = {
      startDate: new Date(formValue.startDate),
      endDate: new Date(formValue.endDate),
      scheduledExercises: formValue.scheduledExercises.map((exercise: any) => ({
        exerciseId: Number(exercise.exerciseId),
        day: new Date(exercise.day),
      })),
    };
    return this.exerciseScheduleService.createExerciseSchedule(
      this.traineeId,
      createData
    );
  }

  private updateScheduleOperation(formValue: any) {
    const updateData: UpdateExerciseScheduleRequest = {
      startDate: new Date(formValue.startDate),
      endDate: new Date(formValue.endDate),
      scheduledExercises: formValue.scheduledExercises.map((exercise: any) => ({
        id: exercise.id,
        exerciseId: Number(exercise.exerciseId),
        day: new Date(exercise.day),
      })),
    };
    return this.exerciseScheduleService.updateExerciseSchedule(
      this.scheduleId!,
      updateData
    );
  }

  getExercisesForMuscle(muscleId: number): Exercise[] {
    if (!muscleId) return [];
    const muscle = this.muscles.find((m) => m.id === muscleId);
    return muscle ? muscle.exercises : [];
  }

  // Method to manually trigger validation (call this when you want to show errors)
  triggerValidation(): void {
    this.validateFormData();
    this.exerciseForm.markAllAsTouched(); // This will show Angular's built-in validation errors too
  }

  onCancel(): void {
    this.formCancelled.emit();
  }
}
