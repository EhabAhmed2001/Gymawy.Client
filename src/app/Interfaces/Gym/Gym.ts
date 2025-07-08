import { Address } from "../Shared/Shared";
export interface Gym {
  Name :string,
  Phone:string,
  Description :string,
  GymType :number,
  GymOwnerId:number,
  Address:Address ,
  GymExtraFeatures:GymExtraFeatureDto[],
  GymFeatures:GymFeatureDto[],
  GymImages:File[],
  //Media:File|null
}


export interface GymExtraFeatureDto {
  Name:string,
//  Image:string,
  Description:string,
  Cost:number
}

export interface GymFeatureDto{
  FeatureId:number,
  //Image:string,
  Description:string,
  Cost:number
}

export interface SelectedGymFeature{
  FeatureId:number|any,
  Name:string|null,
  Image:File|any,
  ImageUrl:string|any,
  Description:string,
  Cost:number
}
export interface GymGet {
  address:Address,
  gymType:number,
  mediaUrl:string,
  gymImagesUrl:string[],
  name:string,
  phone:string,
  description:string
}
export interface GymUpdate {
  name :string,
  phone:string,
  description :string,
  gymType :number,
  address:Address 
}
