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

export interface GymMembership{
  id: number;
  name: string;
  description: string;
  cost: number;
  duration: number; // in days
  count: number; // number of memberships available
  features: {
    id: number;
    name: string;
    image: string; // URL or path to the image
    description: string;
  }[];
}

export interface GymFeatures{
  id: number;
  image: string; // URL or path to the image
  description: string;
  cost: number; // cost of the feature
  name: string; // name of the feature
  isExtra: boolean; 
}

export interface GymClasses{

  id: number;
  name: string;
  description: string;
  cost: number; // cost of the class
  capacity: number; // maximum number of participants
  currentCapacity: number; // current number of participants
  coach: {
    firstName: string;
    lastName: string;
    imageUrl: string; 
    id: number;
  };
}