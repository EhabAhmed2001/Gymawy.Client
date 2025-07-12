import { Component, OnInit, OnDestroy, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DietService } from '../../../Services/diet.service';
import { CreateDietRequest, UpdateDietRequest, DietResponse } from '../../../Interface/Coach/diet';

@Component({
  selector: 'app-diet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './diet-form.component.html',
  styleUrls: ['./diet-form.component.css']
})
export class DietFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dietService = inject(DietService);
  private destroy$ = new Subject<void>();

  @Input() traineeId!: number;
  @Input() dietId?: number;
  @Input() isEditMode = false;
  @Output() formSubmitted = new EventEmitter<DietResponse>();
  @Output() formCancelled = new EventEmitter<void>();

  dietForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  validationErrors: string[] = []; // Add this to store validation errors

  ngOnInit(): void {
    this.initializeForm();

    if (this.isEditMode && this.dietId) {
      this.loadDietData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.dietForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      meals: this.fb.array([], [Validators.required, Validators.minLength(3)])
    });

    // Add 3 empty meals by default
    for (let i = 0; i < 3; i++) {
      this.addMeal();
    }
  }

  private createMealFormGroup(meal?: any): FormGroup {
    return this.fb.group({
      id: [meal?.id || null],
      description: [meal?.description || '', Validators.required],
      day: [meal?.day ? this.formatDateForInput(meal.day) : '', Validators.required],
      mealType: [meal?.mealType ?? '', Validators.required]
    });
  }

  private loadDietData(): void {
    if (!this.dietId) return;

    this.dietService.getDietById(this.dietId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (diet) => {
          this.populateForm(diet);
        },
        error: (error) => {
          console.error('Error loading diet data:', error);
          this.errorMessage = 'Failed to load diet data. Please try again.';
        }
      });
  }

  private populateForm(diet: DietResponse): void {
    this.dietForm.patchValue({
      startDate: this.formatDateForInput(diet.startDate),
      endDate: this.formatDateForInput(diet.endDate)
    });

    this.mealsFormArray.clear();
    diet.meals.forEach(meal => {
      this.mealsFormArray.push(this.createMealFormGroup(meal));
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  get mealsFormArray(): FormArray {
    return this.dietForm.get('meals') as FormArray;
  }

  addMeal(): void {
    this.mealsFormArray.push(this.createMealFormGroup());
  }

  removeMeal(index: number): void {
    if (this.mealsFormArray.length > 3) {
      this.mealsFormArray.removeAt(index);
    }
  }

  getFieldError(fieldName: string): boolean {
    const field = this.dietForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getMealFieldError(mealIndex: number, fieldName: string): boolean {
    const meal = this.mealsFormArray.at(mealIndex);
    const field = meal.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  get mealsError(): string | null {
    const mealsControl = this.mealsFormArray;
    if (mealsControl.hasError('minlength')) {
      return 'At least 3 meals are required';
    }
    return null;
  }

  // Add method to validate using the service
  private validateFormData(): boolean {
    if (!this.dietForm.valid) {
      this.dietForm.markAllAsTouched();
      return false;
    }

    const formValue = this.dietForm.value;
    const dietData = this.prepareDietData(formValue);

    // Use the service's validation method
    this.validationErrors = this.dietService.validateDietData(dietData);

    if (this.validationErrors.length > 0) {
      this.errorMessage = this.validationErrors.join(', ');
      return false;
    }

    this.errorMessage = null;
    return true;
  }

  // Helper method to prepare diet data for validation
  private prepareDietData(formValue: any): CreateDietRequest | UpdateDietRequest {
    const baseData = {
      startDate: new Date(formValue.startDate),
      endDate: new Date(formValue.endDate),
      meals: formValue.meals.map((meal: any) => ({
        description: meal.description,
        day: new Date(meal.day),
        mealType: Number(meal.mealType)
      }))
    };

    if (this.isEditMode) {
      return {
        ...baseData,
        meals: formValue.meals.map((meal: any) => ({
          ...meal,
          day: new Date(meal.day),
          mealType: Number(meal.mealType)
        }))
      } as UpdateDietRequest;
    }

    return baseData as CreateDietRequest;
  }

  // Updated onSubmit method with validation
  onSubmit(): void {
    if (!this.validateFormData() || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.validationErrors = [];

    const formValue = this.dietForm.value;
    const operation = this.isEditMode && this.dietId
      ? this.updateDietOperation(formValue)
      : this.createDietOperation(formValue);

    operation.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message: string) => {
          this.isSubmitting = false;
          this.fetchCurrentDiet();
        },
        error: (error) => {
          console.error('Operation failed:', error);
          this.errorMessage = error.message || 'An error occurred. Please try again.';
          this.isSubmitting = false;
        }
      });
  }

  private fetchCurrentDiet(): void {
    if (this.isEditMode && this.dietId) {
      this.dietService.getDietById(this.dietId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (diet: DietResponse) => {
            this.formSubmitted.emit(diet);
          },
          error: (error) => {
            console.error('Error fetching updated diet:', error);
            this.errorMessage = 'Diet updated but failed to load details.';
          }
        });
    } else {
      this.dietService.getDietByTraineeId(this.traineeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (diet: DietResponse) => {
            this.formSubmitted.emit(diet);
          },
          error: (error) => {
            console.error('Error fetching created diet:', error);
            this.errorMessage = 'Diet created but failed to load details.';
          }
        });
    }
  }

  private createDietOperation(formValue: any) {
    const createData: CreateDietRequest = {
      startDate: new Date(formValue.startDate),
      endDate: new Date(formValue.endDate),
      meals: formValue.meals.map((meal: any) => ({
        description: meal.description,
        day: new Date(meal.day),
        mealType: Number(meal.mealType)
      }))
    };
    return this.dietService.createDiet(this.traineeId, createData);
  }

  private updateDietOperation(formValue: any) {
    const updateData: UpdateDietRequest = {
      startDate: new Date(formValue.startDate),
      endDate: new Date(formValue.endDate),
      meals: formValue.meals.map((meal: any) => ({
        ...meal,
        day: new Date(meal.day),
        mealType: Number(meal.mealType)
      }))
    };
    return this.dietService.updateDiet(this.dietId!, updateData);
  }

  onCancel(): void {
    this.formCancelled.emit();
  }

  // Optional: Add method to validate on blur/change events
  onFormChange(): void {
    if (this.dietForm.dirty) {
      this.validateFormData();
    }
  }
}
