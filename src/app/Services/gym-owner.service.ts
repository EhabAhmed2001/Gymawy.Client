import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GymBasicInfo } from '../Interface/GymBasicInfo';
import { environment } from '../../environments/environment';
import { GymOwnerInfo } from '../Interface/GymOwnerInfo';

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

  getOwnerInfo(id:number):Observable<GymOwnerInfo>
  {
    return this.httpClient.get<GymOwnerInfo>(`${this.apiUrl}/GymOwner/${id}/Info`);
  }
}
