import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CoachService } from '../../../Services/coach.service';
import { DietService } from '../../../Services/diet.service';
import { ExerciseScheduleService } from '../../../Services/exercise-schedule.service';
import { TraineeDetails } from '../../../Interface/Coach/CoachDashboard';
import { DietResponse } from '../../../Interface/Coach/diet';
import { ExerciseScheduleResponse } from '../../../Interface/Coach/exercise-schedule';
import { DietFormComponent } from '../diet-form/diet-form.component';
import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';

@Component({
  selector: 'app-trainee-details',
  standalone: true,
  imports: [CommonModule, DietFormComponent, ExerciseFormComponent],
  templateUrl: './trainee-details.component.html',
  styleUrls: ['./trainee-details.component.css']
})
export class TraineeDetailsComponent implements OnInit, OnDestroy {
  trainee: TraineeDetails | null = null;
  loading = false;
  error: string | null = null;
  showDietForm = false;
  currentDiet: DietResponse | null = null;
  showExerciseForm = false;
  currentExerciseSchedule: ExerciseScheduleResponse | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private coachService: CoachService,
    private dietService: DietService,
    private exerciseScheduleService: ExerciseScheduleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadTraineeDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTraineeDetails(): void {
    const traineeId = Number(this.route.snapshot.paramMap.get('traineeId'));

    if (!traineeId || isNaN(traineeId)) {
      this.error = 'Invalid trainee ID';
      return;
    }

    this.loading = true;
    this.error = null;

    this.coachService.GetTraineeDetails(traineeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (traineeDetails) => {
          this.trainee = traineeDetails;
          this.loadDietForTrainee(traineeId);
          this.loadExerciseScheduleForTrainee(traineeId);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading trainee details:', error);
          this.error = 'Failed to load trainee details. Please try again.';
          this.loading = false;
        }
      });
  }

  loadDietForTrainee(traineeId: number): void {
    this.dietService.getDietByTraineeId(traineeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (diet) => {
          this.currentDiet = diet;
        },
        error: (error) => {
          if (error.status !== 404) {
            console.error('Error loading diet:', error);
          }
        }
      });
  }

  loadExerciseScheduleForTrainee(traineeId: number): void {
    this.exerciseScheduleService.getExerciseScheduleByTrainee(traineeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (schedule) => {
          this.currentExerciseSchedule = schedule;
        },
        error: (error) => {
          if (error.status !== 404) {
            console.error('Error loading exercise schedule:', error);
          }
        }
      });
  }

  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/120x120/4361ee/ffffff?text=No+Image';
  }

  // Diet methods
  onAssignDiet(): void {
    this.showDietForm = true;
  }

  onDietSubmitted(diet: DietResponse): void {
    this.currentDiet = diet;
    this.showDietForm = false;
  }

  onDietCancelled(): void {
    this.showDietForm = false;
  }

  onEditDiet(): void {
    this.showDietForm = true;
  }

  onDeleteDiet(): void {
  if (this.currentDiet && confirm('Are you sure you want to delete this diet plan?')) {
    this.dietService.deleteDiet(this.currentDiet.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message: string) => {
          // Success case - even if we get an HTTP error but the operation succeeded
          this.currentDiet = null;
          console.log('Diet deleted successfully:', message);
        },
        error: (error) => {
          console.error('Error response from delete:', error);

          // Special handling for status 0 errors
          if (error.status === 0) {
            // This might actually be a success case if the operation completed but the connection was interrupted
            // Verify with your API if the delete actually worked
            this.currentDiet = null;
            console.warn('Connection interrupted, but delete may have succeeded');
          } else {
            // For other errors, show error message
            this.error = 'Failed to delete diet. Please try again.';
          }
        }
      });
  }
}

  getMealTypeName(mealType: number): string {
    switch (mealType) {
      case 0: return 'Breakfast';
      case 1: return 'Lunch';
      case 2: return 'Dinner';
      case 3: return 'Snack';
      default: return 'Meal';
    }
  }

  // Exercise Schedule methods
  onAssignExercises(): void {
    this.showExerciseForm = true;
  }

  onExerciseScheduleSubmitted(schedule: ExerciseScheduleResponse): void {
    this.currentExerciseSchedule = schedule;
    this.showExerciseForm = false;
  }

  onExerciseScheduleCancelled(): void {
    this.showExerciseForm = false;
  }

  onEditExerciseSchedule(): void {
    this.showExerciseForm = true;
  }

  onDeleteExerciseSchedule(): void {
    if (this.currentExerciseSchedule && confirm('Are you sure you want to delete this exercise schedule?')) {
      this.exerciseScheduleService.deleteExerciseSchedule(this.currentExerciseSchedule.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.currentExerciseSchedule = null;
          },
          error: (error) => {
            console.error('Error deleting exercise schedule:', error);
          }
        });
    }
  }
}
