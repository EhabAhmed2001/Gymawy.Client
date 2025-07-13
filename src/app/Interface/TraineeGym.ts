export interface GymDetails {
  id: number;
  gymType: string;
  logo: string;
  name: string;
  phone: string;
  description: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
}

export interface MembershipFeatures{
    id: number;
    name: string;
    image: string; // URL or path to the image
    description: string;
}

export interface GymMembership {
  id: number;
  name: string;
  description: string;
  cost: number;
  duration: number; // in days
  count: number; // number of memberships available
  features:MembershipFeatures [];
}

export interface GymFeatures {
  id: number;
  image: string; // URL or path to the image
  description: string;
  cost: number; // cost of the feature
  name: string; // name of the feature
  isExtra: boolean;
}

export interface GymClasses {
  id: number;
  name: string;
  description: string;
  cost: number; // cost of the class per session
  capacity: number; // maximum number of participants
  currentCapacity: number; // current number of participants
  coach: CoachDetails;
}

export interface CoachDetails {
  firstName: string;
  lastName: string;
  imageUrl: string;
  id: number;
}

export interface TraineeCoachDetails {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  imageUrl: string;
  about: string;
  traineeCount: number;
}

export interface TraineeFeatures {
  name: string;
  count: number;
  sessionCost: number;
  totalCost: number;
}

export interface TraineeSubscription {
  membershipStartDate: Date;
  membershipEndDate: Date;
  gymData: GymDetails;
  membership: GymMembership;
  features: TraineeFeatures[];
  class: GymClasses[];
}

// ========================  Trainee Diet Interface =====================================

export enum MealType {
  breakfast = 0,
  lunch = 1,
  dinner = 2,
  snack = 3
}

export const MealTypeLabels: Record<MealType, string> = {
  [MealType.breakfast]: 'Breakfast',
  [MealType.lunch]: 'Lunch',
  [MealType.dinner]: 'Dinner',
  [MealType.snack]: 'Snack'
};

export interface TraineeMeal {
  id: number;
  description: string;
  day: Date; // or Date if you convert it
  mealType: number; // you can use an enum if you want
}

export interface TraineeDiet{
  id: number;
  startDate: Date;
  endDate: Date;
  coachId: number;
  traineeId: number;
  meals: TraineeMeal[];
}

// ========================  Trainee Exercises Interface =====================================

export interface TraineeExerciseSchedule {
  id: number;
  startDate: Date | string;
  endDate: Date | string;
  coachId: number;
  traineeId: number;
  scheduledExercises: ScheduledExercise[];
}
export interface ScheduledExercise {
  id: number;
  day: Date | string;
  exercise: Exercise;
}
export interface Exercise {
  id: number;
  name: string;
  description: string;
  instructions: string;
  videoUrl: string;
  imageUrl: string;
  targetMuscle: TargetMuscle;
}
export interface TargetMuscle {
  name: string;
  imageUrl: string;
}


export interface TraineeData
{
  id:number,
  firstName:string,
  lastName:string,
  address: {
    street: string;
    city: string;
    country: string;
  };
  imageUrl: string;
  dateOfBirth?: Date;
  weight?: number;
}




export interface Address {
  street: string;
  city: string;
  country: string;
}

export interface TraineeInfo{
  firstName: string
  lastName: string
  address: Address
  imageUrl: string
  dateOfBirth: Date
  phoneNumber?: string
  reasonForJoining: string
  weight: string
  userName?: string
}

export interface EditTraineeProfileDto {
  firstName: string;
  lastName: string;
  address: Address;
  image?: File;
  dateOfBirth: Date;
  phoneNumber: string;
  reasonForJoining: string;
  weight?: number;
}