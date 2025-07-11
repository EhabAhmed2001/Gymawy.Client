import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoachData } from '../Interface/Coach/CoachDashboard';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PendingCoach } from '../Interfaces/Coach';
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
  GetGymPendingCoachs(gymId:number):Observable<PendingCoach[]>{
    console.log(`${this.apiUrl}/PendingCoach/${gymId}`)
    return this.httpClient.get<PendingCoach[]>(`${this.apiUrl}/GymPendingCoach/${gymId}`)
  }
  HandleCoachJobRequest(gymId:number,jobRequest:any):Observable<any>{
    return this.httpClient.post(`${this.apiUrl}/HandleCoachJobRequest/${gymId}`,jobRequest)
  }




getCoachByUserName(username:string): Observable<ICoachInfo> {
  return this.httpClient.get<ICoachInfo>(`${this.baseUrl}/coach/${username}`);
}

  getSpecializations(): Observable<ISpecializationOption[]> {
    return this.httpClient.get<ISpecializationOption[]>(`${this.baseUrl}/account/specializations`);

}







}
