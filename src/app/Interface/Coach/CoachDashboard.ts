export interface Gym {
  id: number;
  name: string;
  logo: string;
}

export interface CoachClass {
  id: number;
  name: string;
  cost: number;
  currentCapacity: number;
}

export interface Trainee {
  id: number;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export interface CoachData {
  gyms: Gym[];
  classes: CoachClass[];
  trainees: Trainee[];
}
