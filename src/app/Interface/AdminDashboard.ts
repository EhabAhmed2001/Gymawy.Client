export interface adminDashboard {
  numGyms:number,
  numGymOwners:number,
  numCoaches:number,
  numTrainees:number,
  numPendingGyms:number,
  ownerStatDto: ownerStatDto[]
}

export interface ownerStatDto {
  firstName: string,
  lastName: string,
  userName: string,
  numGyms: number,
  numTrainees: number,
  numClasses: number,
  numMemberships: number,
  profit: number
}
