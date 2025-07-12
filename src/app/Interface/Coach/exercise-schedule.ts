export interface CreateExerciseScheduleRequest {
  startDate: Date;
  endDate: Date;
  scheduledExercises: ScheduledExerciseRequest[];
}

export interface UpdateExerciseScheduleRequest {
  startDate: Date;
  endDate: Date;
  scheduledExercises: ScheduledExerciseUpdateRequest[];
}

export interface ScheduledExerciseRequest {
  exerciseId: number;
  day: Date;
}

export interface ScheduledExerciseUpdateRequest extends ScheduledExerciseRequest {
  id: number;
}

export interface ExerciseScheduleResponse {
  id: number;
  traineeId: number;
  startDate: Date;
  endDate: Date;
  scheduledExercises: ScheduledExerciseResponse[];
}

export interface ScheduledExerciseResponse {
  id: number;
  day: Date;
  exerciseId: number;
  exerciseName: string;
  exerciseDescription: string;
  exerciseImage: string;
}
export interface ApiExerciseScheduleResponse {
  id: number;
  startDate: string;  // ISO date string
  endDate: string;    // ISO date string
  coachId: number;
  traineeId: number;
  scheduledExercises: {
    id: number;
    day: string;      // ISO date string
    exercise: {
      id: number;
      name: string;
      description: string;
      instructions: string;
      videoUrl: string;
      imageUrl: string;
      targetMuscle: {
        name: string;
        imageUrl: string;
      };
    };
  }[];
}
