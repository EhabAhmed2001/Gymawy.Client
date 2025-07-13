export interface ICoachInfo {
  firstName: string
  lastName: string
  userName: string
  specializations: string
  address: Address
  photoUrl: string
  age: number
}

export interface Address {
  street: string
  city: string
  country: string
  location: Location
}

export interface Location {
  x: number
  y: number
}
