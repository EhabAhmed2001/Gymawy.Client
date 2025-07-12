import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import{Coach} from'../Interface/Coach';
@Injectable({
  providedIn: 'root'
})
export class CoachService {

  private url='http://localhost:5000/api'
  constructor(private httpClient: HttpClient) {}

getCoachesBygym(gymid:number):Observable<Coach[]>
    {
      return this.httpClient.get<Coach[]>(`${this.url}/Coach/GetCoachesBygem/${gymid}`);
    }
    
  }

