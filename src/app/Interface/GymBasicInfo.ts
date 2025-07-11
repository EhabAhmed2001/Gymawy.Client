export interface GymBasicInfo {
  id:number,
  gymType: string,
  name: string,
  phone: string,
  description: string,
  address: Address
}

export interface Address {
  street: string,
  city: string,
  country: string
}
