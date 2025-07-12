import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DietResponse, CreateDietRequest, UpdateDietRequest } from '../Interface/Coach/diet';

@Injectable({
  providedIn: 'root'
})
export class DietService {
  private baseUrl = `${environment.apiUrl}/Coach/diet`;

  constructor(private httpClient: HttpClient) {}

  private getTextHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });
  }

  createDiet(traineeId: number, dietData: CreateDietRequest): Observable<string> {
    const url = `${this.baseUrl}/${traineeId}`;
    return this.httpClient.post(url, dietData, {
      headers: this.getTextHeaders(),
      responseType: 'text'
    });
  }

  getDietById(dietId: number): Observable<DietResponse> {
    const url = `${this.baseUrl}/${dietId}`;
    return this.httpClient.get<DietResponse>(url);
  }

  updateDiet(dietId: number, dietData: UpdateDietRequest): Observable<string> {
    const url = `${this.baseUrl}/${dietId}`;
    return this.httpClient.put(url, dietData, {
      headers: this.getTextHeaders(),
      responseType: 'text'
    });
  }

  deleteDiet(dietId: number): Observable<string> {
    const url = `${this.baseUrl}/${dietId}`;
    return this.httpClient.delete(url, {
      headers: this.getTextHeaders(),
      responseType: 'text'
    });
  }

  getDietByTraineeId(traineeId: number): Observable<DietResponse> {
    const url = `${environment.apiUrl}/Coach/diets/${traineeId}`;
    return this.httpClient.get<DietResponse>(url);
  }

  getMealTypeDisplayName(mealType: number): string {
    switch (mealType) {
      case 0: return 'Breakfast';
      case 1: return 'Lunch';
      case 2: return 'Dinner';
      case 3: return 'Snack';
      default: return 'Unknown';
    }
  }

  validateDietData(dietData: CreateDietRequest | UpdateDietRequest): string[] {
    const errors: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    // Validate start date
    if (!dietData.startDate) {
      errors.push('Start date is required');
    } else {
      const startDate = new Date(dietData.startDate);
      startDate.setHours(0, 0, 0, 0);

      // Check if start date is today or in the future
      if (startDate < today) {
        errors.push('Start date must be today or in the future');
      }
    }

    // Validate end date
    if (!dietData.endDate) {
      errors.push('End date is required');
    }

    // Validate date range
    if (dietData.startDate && dietData.endDate) {
      const startDate = new Date(dietData.startDate);
      const endDate = new Date(dietData.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (endDate <= startDate) {
        errors.push('End date must be after start date');
      }
    }

    // Validate meals count
    if (!dietData.meals || dietData.meals.length < 3) {
      errors.push('At least 3 meals are required');
    }

    // Validate individual meals
    if (dietData.meals) {
      const startDate = dietData.startDate ? new Date(dietData.startDate) : null;
      const endDate = dietData.endDate ? new Date(dietData.endDate) : null;

      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(0, 0, 0, 0);

      dietData.meals.forEach((meal, index) => {
        const mealNumber = index + 1;

        // Validate meal description
        if (!meal.description || meal.description.trim() === '') {
          errors.push(`Meal ${mealNumber}: Description is required`);
        }

        // Validate meal day
        if (!meal.day) {
          errors.push(`Meal ${mealNumber}: Day is required`);
        } else {
          const mealDay = new Date(meal.day);
          mealDay.setHours(0, 0, 0, 0);

          // Check if meal day is within the diet date range
          if (startDate && endDate) {
            if (mealDay < startDate) {
              errors.push(`Meal ${mealNumber}: Day must be on or after the diet start date`);
            }
            if (mealDay > endDate) {
              errors.push(`Meal ${mealNumber}: Day must be on or before the diet end date`);
            }
          }
        }

        // Validate meal type
        if (meal.mealType === null || meal.mealType === undefined) {
          errors.push(`Meal ${mealNumber}: Meal type is required`);
        } else if (![0, 1, 2, 3].includes(meal.mealType)) {
          errors.push(`Meal ${mealNumber}: Invalid meal type`);
        }
      });
    }

    return errors;
  }

  // Helper method to check if a date is within a range
  private isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    checkDate.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return checkDate >= start && checkDate <= end;
  }

  // Helper method to format date for display in error messages
  private formatDateForDisplay(date: Date): string {
    return date.toLocaleDateString();
  }
}
