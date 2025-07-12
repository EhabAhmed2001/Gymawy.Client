export interface Muscle {
  id: number;
  name: string;
  imageUrl?: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  muscleId: number;
}
