import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoachData } from '../Interface/Coach/CoachDashboard';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CoachService {

  private apiUrl = `${environment.apiUrl}/Coach`;
  constructor(private httpClient: HttpClient) {}

  GetCoachDashboard(coachId: number): Observable<CoachData> {
    return this.httpClient.get<CoachData>(`${this.apiUrl}/Dashboard/${coachId}`);
  }
}
