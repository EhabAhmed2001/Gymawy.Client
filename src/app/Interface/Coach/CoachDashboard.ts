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
export interface TraineeDetails {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  dateOfBirth: Date;
  reasonForJoining: string;
  weight: number;
  gymName: string;
}

export interface CoachData {
  gyms: Gym[];
  classes: CoachClass[];
  trainees: Trainee[];
}
