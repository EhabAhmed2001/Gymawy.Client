import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GymClasses, GymFeatures, GymMembership, GymDetails } from '../Interface/TraineeGym';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TraineeService {

  private apiUrl = `${environment.apiUrl}/Trainee`;
  constructor(private httpClient: HttpClient) { }

  GetAllGyms(): Observable<GymDetails[]> {
    return this.httpClient.get<GymDetails[]>(`${this.apiUrl}/all-gyms`);
  }

  GetGymDetails(gymId: number): Observable<GymDetails> {
    return this.httpClient.get<GymDetails>(`${this.apiUrl}/gym/${gymId}`);
  }

  GetMembershipByGymId(gymId: number): Observable<GymMembership[]> {
    return this.httpClient.get<GymMembership[]>(`${this.apiUrl}/get-memberships/${gymId}`);
  }

  GetGymClasses(gymId: number): Observable<GymClasses[]> {
    return this.httpClient.get<GymClasses[]>(`${this.apiUrl}/classes/${gymId}`);
  }

  GetGymFeatures(gymId: number): Observable<GymFeatures[]> {
    return this.httpClient.get<GymFeatures[]>(`${this.apiUrl}/features/${gymId}`);
  }

}
