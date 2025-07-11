import { Component, Input } from '@angular/core';
import { TraineeDetails } from '../../../Interface/Coach/CoachDashboard';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CoachService } from '../../../Services/coach.service';
@Component({
  selector: 'app-trainee-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './trainee-details.component.html',
  styleUrl: './trainee-details.component.css'
})
export class TraineeDetailsComponent {

  trainee: TraineeDetails | null = null;
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private _coachService: CoachService, private route: ActivatedRoute){}

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

    this._coachService.GetTraineeDetails(traineeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (traineeDetails) => {
          this.trainee = traineeDetails;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading trainee details:', error);
          this.error = 'Failed to load trainee details. Please try again.';
          this.loading = false;
        }
      });
    }

  // formatDate(date: Date): string {
  //   return new Date(date).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // }

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

  onAssignDiet(): void {
    console.log('Assign Diet clicked for trainee:', this.trainee?.id);
  }

  onAssignExercises(): void {
    console.log('Assign Exercises clicked for trainee:', this.trainee?.id);
  }
}
