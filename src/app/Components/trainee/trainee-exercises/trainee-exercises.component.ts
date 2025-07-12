import { Component, signal } from '@angular/core';
import { TraineeExerciseSchedule } from '../../../Interface/TraineeGym';
import { TraineeService } from '../../../Services/trainee.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trainee-exercises',
  imports: [DatePipe],
  templateUrl: './trainee-exercises.component.html',
  styleUrl: './trainee-exercises.component.css'
})
export class TraineeExercisesComponent {
 isLoading = signal(true);
  error = signal<string | null>(null);
  exercisePlans = signal<TraineeExerciseSchedule[]>([]);

  constructor(private traineeService: TraineeService) {}

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules() {
    this.isLoading.set(true);
    this.error.set(null);

    this.traineeService.GetExercises().subscribe({
      next: (plans) => {
        const parsed = plans.map(plan => ({
          ...plan,
          startDate: new Date(plan.startDate),
          endDate: new Date(plan.endDate),
          scheduledExercises: plan.scheduledExercises.map(ex => ({
            ...ex,
            day: new Date(ex.day)
          }))
        }));

        this.exercisePlans.set(parsed);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading schedules:', err);
        this.error.set('Failed to load exercise plans.');
        this.isLoading.set(false);
      }
    });
  }
}
