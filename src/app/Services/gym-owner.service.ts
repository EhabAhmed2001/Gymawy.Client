import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GymBasicInfo } from '../Interface/GymBasicInfo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GymOwnerService {
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  getGymsForOwner(id: number):Observable<GymBasicInfo[]>
  {
    return this.httpClient.get<GymBasicInfo[]>(`${this.apiUrl}/GymOwner/${id}/Gyms`);
  }
}
