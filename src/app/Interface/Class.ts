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
  date: Date;
  coachId: number | null;
  gymId: number;
}

export interface Coach {
  firstName: string,
  lastName: string,
  id: number
}

export interface Trainee {
  id: number,
  firstName: string,
  lastName: string,
  phoneNumber: string
}
