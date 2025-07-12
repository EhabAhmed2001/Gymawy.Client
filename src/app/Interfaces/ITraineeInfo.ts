import { Address } from "./ICoach"

export interface ITraineeInfo{
  firstName: string
  lastName: string
  userName: string
  reasonForJoining: string
  age: number
  gym: string
  coach: string
  weight: string
  membershipStartDate: any
  address: Address
  photoUrl: string
}
