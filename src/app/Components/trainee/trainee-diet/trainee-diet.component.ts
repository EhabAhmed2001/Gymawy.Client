import { Component, computed, Input, signal } from '@angular/core';
import { TraineeService } from '../../../Services/trainee.service';
import { MealType, MealTypeLabels, TraineeDiet, TraineeMeal } from '../../../Interface/TraineeGym';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-trainee-diet',
  imports: [DatePipe, CommonModule],
  templateUrl: './trainee-diet.component.html',
  styleUrl: './trainee-diet.component.css'
})
export class TraineeDietComponent {
    traineeDiets = signal<TraineeDiet[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor(private _traineeService: TraineeService) {}

  ngOnInit(): void {
    this.loadDiet();
  }

  loadDiet(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this._traineeService.GetDiet().subscribe({
      next: (diets) => {
        const processed = diets.map(diet => ({
          ...diet,
          startDate: new Date(diet.startDate),
          endDate: new Date(diet.endDate),
          meals: diet.meals.map(meal => ({
            ...meal,
            day: new Date(meal.day)
          }))
        }));
        this.traineeDiets.set(processed);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching diets:', err);
        this.error.set('Failed to load meal schedule.');
        this.isLoading.set(false);
      }
    });
  }

  getGroupedMeals(meals: TraineeMeal[]) {
    const grouped = meals.reduce((acc, meal) => {
      const dateKey = meal.day.toISOString().split('T')[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(meal);
      return acc;
    }, {} as Record<string, TraineeMeal[]>);

    return Object.entries(grouped)
      .map(([date, meals]) => ({
        day: new Date(date),
        meals: meals.sort((a, b) => a.day.getTime() - b.day.getTime())
      }))
      .sort((a, b) => a.day.getTime() - b.day.getTime());
  }

  getMealTypeLabel(mealType: MealType): string {
    return MealTypeLabels[mealType] ?? 'Unknown';
  }

  getMealIcon(mealType: MealType): string {
    const icons: Record<MealType, string> = {
      [MealType.breakfast]: 'bi-cup-hot',
      [MealType.lunch]: 'bi-egg-fried',
      [MealType.dinner]: 'bi-moon',
      [MealType.snack]: 'bi-apple'
    };
    return icons[mealType] ?? 'bi-egg';
  }
}
