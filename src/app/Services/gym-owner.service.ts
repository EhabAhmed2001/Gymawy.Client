import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GymBasicInfo } from '../Interface/GymBasicInfo';
import { environment } from '../../environments/environment';
import { IOwnerInfo } from '../Interfaces/IOwnerInfo';
import { GymOwnerInfo } from '../Interface/GymOwnerInfo';

@Injectable({
  providedIn: 'root'
})
export class GymOwnerService {
  private apiUrl = environment.apiUrl;
  private readonly baseUrl:string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getGymsForOwner():Observable<GymBasicInfo[]>
  {
    //return this.httpClient.get<GymBasicInfo[]>(`${this.apiUrl}/GymOwner/${id}/Gyms`);
    console.log("serivce");
    return this.httpClient.get<GymBasicInfo[]>(`${this.baseUrl}/gymowner/Gyms`);
  }

  getOwnerInfo():Observable<GymOwnerInfo>
  {
    //return this.httpClient.get<GymOwnerInfo>(`${this.apiUrl}/GymOwner/${id}/Info`);
        return this.httpClient.get<GymOwnerInfo>(`${this.baseUrl}/gymowner/Info`);

  }

getOwnerByUserName(username:string): Observable<IOwnerInfo> {
  return this.httpClient.get<IOwnerInfo>(`${this.baseUrl}/gymowner/${username}`);
}


}
