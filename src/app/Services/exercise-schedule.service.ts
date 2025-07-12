import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  CreateExerciseScheduleRequest,
  UpdateExerciseScheduleRequest,
  ExerciseScheduleResponse,
  ApiExerciseScheduleResponse,
} from '../Interface/Coach/exercise-schedule';
import { environment } from '../../environments/environment';
import { Muscle } from '../Interface/Coach/muscle';

@Injectable({
  providedIn: 'root',
})
export class ExerciseScheduleService {
  private apiUrl = `${environment.apiUrl}/Coach/exercise-schedule`;

  constructor(private http: HttpClient) {}

  private getTextHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'text/plain',
    });
  }

  createExerciseSchedule(
    traineeId: number,
    data: CreateExerciseScheduleRequest
  ): Observable<string> {
    return this.http.post(`${this.apiUrl}/${traineeId}`, data, {
      headers: this.getTextHeaders(),
      responseType: 'text',
    });
  }

  getExerciseSchedule(
    scheduleId: number
  ): Observable<ExerciseScheduleResponse> {
    return this.http.get<any>(`${this.apiUrl}/${scheduleId}`).pipe(
      map((apiResponse: ApiExerciseScheduleResponse) => ({
        id: apiResponse.id,
        traineeId: apiResponse.traineeId,
        startDate: new Date(apiResponse.startDate),
        endDate: new Date(apiResponse.endDate),
        scheduledExercises: apiResponse.scheduledExercises.map((se: any) => ({
          id: se.id,
          day: new Date(se.day),
          exerciseId: se.exercise.id,
          exerciseName: se.exercise.name,
          exerciseDescription: se.exercise.description,
          exerciseImage: se.exercise.imageUrl,
        })),
      }))
    );
  }
  updateExerciseSchedule(
    scheduleId: number,
    data: UpdateExerciseScheduleRequest
  ): Observable<string> {
    return this.http.put(`${this.apiUrl}/${scheduleId}`, data, {
      headers: this.getTextHeaders(),
      responseType: 'text',
    });
  }

  deleteExerciseSchedule(scheduleId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${scheduleId}`, {
      headers: this.getTextHeaders(),
      responseType: 'text',
    });
  }

  getExerciseScheduleByTrainee(
    traineeId: number
  ): Observable<ExerciseScheduleResponse> {
    return this.http.get<any>(`${this.apiUrl}s/${traineeId}`).pipe(
      map((apiResponse: ApiExerciseScheduleResponse) => ({
        id: apiResponse.id,
        traineeId: apiResponse.traineeId,
        startDate: new Date(apiResponse.startDate),
        endDate: new Date(apiResponse.endDate),
        scheduledExercises: apiResponse.scheduledExercises.map((se: any) => ({
          id: se.id,
          day: new Date(se.day),
          exerciseId: se.exercise.id,
          exerciseName: se.exercise.name,
          exerciseDescription: se.exercise.description,
          exerciseImage: se.exercise.imageUrl,
        })),
      }))
    );
  }

  getAllMusclesWithExercises(): Observable<Muscle[]> {
    return this.http.get<Muscle[]>(`${environment.apiUrl}/Coach/muscles`);
  }

  validateExerciseScheduleData(
    scheduleData: CreateExerciseScheduleRequest | UpdateExerciseScheduleRequest
  ): string[] {
    const errors: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    // Validate start date
    if (!scheduleData.startDate) {
      errors.push('Start date is required');
    } else {
      const startDate = new Date(scheduleData.startDate);
      startDate.setHours(0, 0, 0, 0);

      // Check if start date is today or in the future
      if (startDate < today) {
        errors.push('Start date must be today or in the future');
      }
    }

    // Validate end date
    if (!scheduleData.endDate) {
      errors.push('End date is required');
    }

    // Validate date range
    if (scheduleData.startDate && scheduleData.endDate) {
      const startDate = new Date(scheduleData.startDate);
      const endDate = new Date(scheduleData.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (endDate <= startDate) {
        errors.push('End date must be after start date');
      }
    }

    // Validate scheduled exercises count
    if (
      !scheduleData.scheduledExercises ||
      scheduleData.scheduledExercises.length === 0
    ) {
      errors.push('At least one scheduled exercise is required');
    }

    // Validate individual scheduled exercises
    if (scheduleData.scheduledExercises) {
      const startDate = scheduleData.startDate
        ? new Date(scheduleData.startDate)
        : null;
      const endDate = scheduleData.endDate
        ? new Date(scheduleData.endDate)
        : null;

      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(0, 0, 0, 0);

      scheduleData.scheduledExercises.forEach((exercise, index) => {
        const exerciseNumber = index + 1;

        // Validate exercise ID
        if (!exercise.exerciseId) {
          errors.push(
            `Exercise ${exerciseNumber}: Exercise selection is required`
          );
        }

        // Validate exercise day
        if (!exercise.day) {
          errors.push(`Exercise ${exerciseNumber}: Day is required`);
        } else {
          const exerciseDay = new Date(exercise.day);
          exerciseDay.setHours(0, 0, 0, 0);

          // Check if exercise day is within the schedule date range
          if (startDate && endDate) {
            if (exerciseDay < startDate) {
              errors.push(
                `Exercise ${exerciseNumber}: Day must be on or after the schedule start date`
              );
            }
            if (exerciseDay > endDate) {
              errors.push(
                `Exercise ${exerciseNumber}: Day must be on or before the schedule end date`
              );
            }
          }
        }
      });

      // Check for duplicate exercises on the same day
      const exerciseDayMap = new Map<string, number[]>();
      scheduleData.scheduledExercises.forEach((exercise, index) => {
        if (exercise.day && exercise.exerciseId) {
          const dayKey = new Date(exercise.day).toDateString();
          if (!exerciseDayMap.has(dayKey)) {
            exerciseDayMap.set(dayKey, []);
          }
          exerciseDayMap.get(dayKey)!.push(exercise.exerciseId);
        }
      });

      // Check for duplicates
      exerciseDayMap.forEach((exerciseIds, day) => {
        const duplicates = exerciseIds.filter(
          (id, index) => exerciseIds.indexOf(id) !== index
        );
        if (duplicates.length > 0) {
          errors.push(`Duplicate exercises found on ${day}`);
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
