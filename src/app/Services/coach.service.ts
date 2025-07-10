import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoachData } from '../Interface/Coach/CoachDashboard';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PendingCoach } from '../Interfaces/Coach';
@Injectable({
  providedIn: 'root'
})
export class CoachService {

  private apiUrl = `${environment.apiUrl}/Coach`;
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
}
