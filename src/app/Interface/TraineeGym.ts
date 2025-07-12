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
