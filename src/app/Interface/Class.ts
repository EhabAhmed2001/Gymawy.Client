export interface Class {
  id: number,
  name: string,
  description: string,
  cost: number,
  capacity: number,
  currentCapacity: number,
  coachName: string
}

export interface ClassToSend {
  name: string;
  description: string;
  cost: number;
  currentCapacity: number;
  capacity: number;
  coachId: number;
  gymId: number;
}

export interface Coach {
  firstName: string,
  lastName: string,
  id: number
}
