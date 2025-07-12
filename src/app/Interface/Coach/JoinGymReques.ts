
export interface WorkDayDto {
  day: number;    // 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
  start: string;  // TimeOnly format: HH:MM:SS
  end: string;    // TimeOnly format: HH:MM:SS
}

export interface JoinGymRequest {
  gymId: number;
  workDayDtos: WorkDayDto[];
}
