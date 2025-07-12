// diet.interfaces.ts

export enum MealType {
  Breakfast = 0,
  Lunch = 1,
  Dinner = 2,
  Snack = 3
}

export interface Meal {
  id?: number;
  description: string;
  day: Date;
  mealType: MealType;
}

export interface CreateDietRequest {
  startDate: Date;
  endDate: Date;
  meals: Omit<Meal, 'id'>[];
}

export interface UpdateDietRequest {
  startDate: Date;
  endDate: Date;
  meals: Meal[];
}

export interface DietResponse {
  id: number;
  startDate: Date;
  endDate: Date;
  meals: Meal[];
  traineeId: number;
  createdAt: Date;
  updatedAt: Date;
}
