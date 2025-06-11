import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gym } from '../Interfaces/Gym/Gym';

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
  AddGym(gym: Gym):Observable<any>{
    return this.httpclient.post(`${this.url}/RequestAddGym`,gym)
  }
}
