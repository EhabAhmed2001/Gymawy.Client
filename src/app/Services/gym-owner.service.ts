import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GymBasicInfo } from '../Interface/GymBasicInfo';
import { environment } from '../../environments/environment';
import { GymOwnerInfo } from '../Interface/GymOwnerInfo';
import {GymownerData,GymOwnerMembership  } from '../Interfaces/GymOwnerData';


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

getGymownerData(id:number):Observable<GymownerData[]>
{
      return this.httpClient.get<GymownerData[]>(`${this.apiUrl}/GymOwner/GymOwnerData/${id}`);

}

getGymownerMembership(id:number):Observable<GymOwnerMembership[]>
{
      return this.httpClient.get<GymOwnerMembership[]>(`${this.apiUrl}/GymOwner/GymMemberships/${id}`);

}

}
