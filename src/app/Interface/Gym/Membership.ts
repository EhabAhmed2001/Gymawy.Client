

  export interface MemberShip {

 name:string,
 description:string,
 cost:number,
duration:number,
count:number,
gymId:number,
gymFeaturesId:number[]

  }


  
  export interface Features {
 id: number;
  featureName: string;
  cost: number;
  }


  
  export interface DisplayMemberShips {
id:number
 name:string,
 description:string,
 cost:number,
duration:number,
count:number,
gymid:number,
features:Features[]|any

  }