import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trainee,AssignCoachTrainee} from '../Interface/Trainee';

@Injectable({
  providedIn: 'root'
})
export class TraineeService {

  private url='http://localhost:5000/api'
  constructor(private httpClient: HttpClient) { }


getTraineeByGymId(gymid:number):Observable<Trainee[]>
{
  return this.httpClient.get<Trainee[]>(`${this.url}/Trainee/Trainees/${gymid}`);
}

AssignCoachtoTrainee(data:AssignCoachTrainee)
{
  return this.httpClient.post<{ message: string }>(
    `${this.url}/Trainee/AssignCoachToTrainee`,
    data
  );
}
}
