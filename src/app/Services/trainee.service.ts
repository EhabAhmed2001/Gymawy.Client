import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GymClasses, GymFeatures, GymMembership, GymDetails, TraineeCoachDetails, TraineeSubscription, TraineeDiet, TraineeExerciseSchedule } from '../Interface/TraineeGym';
import { Observable } from 'rxjs/internal/Observable';
import { PaymentReturn } from '../Interfaces/Payment/PaymentReturn';
import { Trainee,AssignCoachTrainee} from '../Interface/Trainee';
import { ITraineeInfo } from '../Interfaces/ITraineeInfo';


@Injectable({
  providedIn: 'root'
})
export class TraineeService {

  private apiUrl = `${environment.apiUrl}/trainee`;
  private readonly baseUrl:string = environment.apiUrl;

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

  GetTraineeCoachDetails(/*coachId: number*/): Observable<TraineeCoachDetails> {
    return this.httpClient.get<TraineeCoachDetails>(`${this.apiUrl}/coach`);
  }

  GetTraineeSubscriptions(): Observable<TraineeSubscription> {
    return this.httpClient.get<TraineeSubscription>(`${this.apiUrl}/subscriptions`);
  }

  // Trainee Diet
  GetDiet(): Observable<TraineeDiet[]> {
    return this.httpClient.get<TraineeDiet[]>(`${this.apiUrl}/diet`);
  }

  GetExercises(): Observable<TraineeExerciseSchedule[]>
  {
    return this.httpClient.get<TraineeExerciseSchedule[]>(`${this.apiUrl}/exercise-schedule`);
  }

  JoinIntoMembership(membershipId: number): Observable<PaymentReturn> {
    return this.httpClient.post<PaymentReturn>(`${this.apiUrl}/assign-membership/${membershipId}`, {});
  }

  JoinToClass(classId: number): Observable<PaymentReturn> {
    return this.httpClient.post<PaymentReturn>(`${this.apiUrl}/join-class/${classId}`, {});
  }

  AddFeature(featureId: number, count: number): Observable<PaymentReturn> {
    const params = { count: count.toString() };

    return this.httpClient.post<PaymentReturn>(
      `${this.apiUrl}/add-feature/${featureId}`,
      {},              // Empty body
      { params }        // Query parameters
    );
  }
  getTraineeByGymId(gymid: number): Observable<Trainee[]> {
    return this.httpClient.get<Trainee[]>(`${this.apiUrl}/Trainees/${gymid}`);
  }

  AssignCoachtoTrainee(data: AssignCoachTrainee) {
    return this.httpClient.post<{ message: string }>(
      `${this.apiUrl}/AssignCoachToTrainee`,
      data
    );
  }

getTraineeByUserName(username:string): Observable<ITraineeInfo> {
  return this.httpClient.get<ITraineeInfo>(`${this.baseUrl}/trainee/${username}`);
}
}
