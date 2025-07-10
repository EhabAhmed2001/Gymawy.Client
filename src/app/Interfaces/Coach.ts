export interface PendingCoach {
  coachId: number;
  name: string;
  specializations: string;
  capcity: number;
  about: string;
  workDays: WorkDayDto[]; // Assuming WorkDayDto is another interface
  applicationDate: string; // ISO date string (e.g., '2025-07-09T12:34:56Z')
  applicationCVUrl: string;
  imageUrl: string;
}
export interface WorkDayDto{
  start:string,
  end:string,
  day:string
}
export interface JobRequest{
  coachId:number,
  isAccepted:boolean
}