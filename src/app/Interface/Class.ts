import { CoachDetails, GymDetails } from "./TraineeGym";

export interface Class {
  id: number,
  name: string,
  description: string,
  cost: number,
  capacity: number,
  currentCapacity: number,
  date: Date,
  coachName: string
}

export interface ClassToSend {
  name: string;
  description: string;
  cost: number;
  currentCapacity: number;
  capacity: number;
  date: Date | string;
  coachId: number | null;
  gymId: number;
}

export interface Coach {
  firstName: string,
  lastName: string,
  id: number,
  currentCapcity:number,
  specializations:string
}

export interface Trainee {
  id: number,
  firstName: string,
  lastName: string,
  phoneNumber: string
}

export interface AllClasses{
  id: number;
  name: string;
  description: string;
  cost: number;
  capacity: number;
  currentCapacity: number;
  coach: CoachDetails;
  gym: GymDetails;
}
