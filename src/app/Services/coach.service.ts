import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoachData, TraineeDetails } from '../Interface/Coach/CoachDashboard';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PendingCoach } from '../Interfaces/Coach';
import{Coach} from'../Interface/Coach';
import { JoinGymRequest } from '../Interface/Coach/JoinGymReques';

import { ISpecializationOption } from '../Interfaces/ISpecializationOption';
import { ICoachInfo } from '../Interfaces/ICoach';

@Injectable({
  providedIn: 'root'
})
export class CoachService {

  private apiUrl = `${environment.apiUrl}/Coach`;
  private readonly baseUrl:string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  GetCoachDashboard(coachId: number): Observable<CoachData> {
    return this.httpClient.get<CoachData>(`${this.apiUrl}/Dashboard/${coachId}`);
  }

  GetTraineeDetails(traineeId: number): Observable<TraineeDetails> {
    return this.httpClient.get<TraineeDetails>(`${this.apiUrl}/Dashboard/traineeDetails/${traineeId}`);
  }

  GetGymPendingCoachs(gymId:number):Observable<PendingCoach[]>{
    console.log(`${this.apiUrl}/PendingCoach/${gymId}`)
    return this.httpClient.get<PendingCoach[]>(`${this.apiUrl}/GymPendingCoach/${gymId}`)
  }

  HandleCoachJobRequest(gymId:number,jobRequest:any):Observable<any>{
    return this.httpClient.post(`${this.apiUrl}/HandleCoachJobRequest/${gymId}`,jobRequest)
  }

  getCoachesBygym(gymid:number):Observable<Coach[]> {
    return this.httpClient.get<Coach[]>(`${this.apiUrl}/GetCoachesBygem/${gymid}`);
  }

  requestToJoinGym(requestData: JoinGymRequest): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/request-coach-gym`, requestData);
  }

getCoachByUserName(username:string): Observable<ICoachInfo> {
  return this.httpClient.get<ICoachInfo>(`${this.baseUrl}/coach/${username}`);
}

  getSpecializations(): Observable<ISpecializationOption[]> {
    return this.httpClient.get<ISpecializationOption[]>(`${this.baseUrl}/account/specializations`);

}







}
