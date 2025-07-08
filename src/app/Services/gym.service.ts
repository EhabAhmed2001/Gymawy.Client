import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gym, GymGet } from '../Interfaces/Gym/Gym';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  private url:string = `${environment.apiUrl}/Gym`
  constructor(private httpclient:HttpClient) {
    
  }

  GetGymTypes():Observable<any>{
    return this.httpclient.get(`${this.url}/GetGymTypes`)
  }
  GetGymFeatures():Observable<any>{
    return this.httpclient.get(`${this.url}/GetGymFeatures`)
  }
  AddGym(gym: any):Observable<any>{
    return this.httpclient.post(`${this.url}/RequestAddGym`,gym)
  }
  GetGymById(gymId:number):Observable<GymGet>{
    return this.httpclient.get<GymGet>(`${this.url}/${gymId}`)
  }
  UpdateGym(gymId:number,data:FormData):Observable<any>{
    return this.httpclient.put(`${this.url}/${gymId}`,data);
  }
}
