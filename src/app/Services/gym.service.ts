import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gym, GymFeature, GymGet } from '../Interfaces/Gym/Gym';

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

  GetFeaturesByGymId(gymId:number):Observable<GymFeature[]>{
    return this.httpclient.get<GymFeature[]>(`${this.url}/Features/${gymId}`)
  }

  GetGymFeatureById(gymFeatureId:number):Observable<GymFeature>{
    return this.httpclient.get<GymFeature>(`${this.url}/Feature/${gymFeatureId}`)
  }
  AddNonExGymFeature(gymId:number,data:FormData):Observable<GymFeature>{
    return this.httpclient.post<GymFeature>(`${this.url}/NonExGymFeature/${gymId}`,data)
  }
  AddExtraGymFeature(gymId:number,data:FormData):Observable<GymFeature>{
    return this.httpclient.post<GymFeature>(`${this.url}/ExtraGymFeature/${gymId}`,data)
  }
  UpdateGymFeature(gymFeatureId:number,data:FormData):Observable<GymFeature>{
    return this.httpclient.put<GymFeature>(`${this.url}/GymFeature/${gymFeatureId}`,data)
  }
  DeleteGymFeature(gymFeatureId:number):Observable<any>{
    return this.httpclient.delete(`${this.url}/GymFeature/${gymFeatureId}`)
  }
}
