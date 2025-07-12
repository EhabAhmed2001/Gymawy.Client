export interface Trainee
{
    id: number,
    name: string,
    memberShipName: string|null,
    membershipStartDate: Date|null,
    membershipEndDate:  Date|null,
   coachName: string,
coachId:number
}

export interface AssignCoachTrainee{
     coachId :number,
   traineeId :number
    oldCoachId:number
    
    }