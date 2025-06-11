import { Address } from "../Shared/Shared";
export interface Gym {
  Name :string,
  Phone:string,
  Description :string,
  GymType :number,
  GymOwnerId:number,
  Address:Address ,
  GymExtraFeatures:GymExtraFeatureDto[],
  GymFeatures:GymFeatureDto[]
}


export interface GymExtraFeatureDto {
  Name:string,
  Image:string,
  Description:string,
  Cost:number
}

export interface GymFeatureDto{
  FeatureId:number,
  Image:string,
  Description:string,
  Cost:number
}

export interface SelectedGymFeature{
  FeatureId:number|any,
  Name:string|null,
  Image:string,
  Description:string,
  Cost:number
}
