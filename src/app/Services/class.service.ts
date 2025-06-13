import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Class, ClassToSend, Coach, Trainee } from '../Interface/Class';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getClassesByGym(gymId: number): Observable<Class[]> {
    return this.httpClient.get<Class[]>(`${this.apiUrl}/Class/Gym/${gymId}`);
  }

  getClassById(classId: number): Observable<Class> {
    return this.httpClient.get<Class>(`${this.apiUrl}/Class/${classId}`);
  }

  createClass(newClass: ClassToSend): Observable<Class>
  {
    return this.httpClient.post<Class>(`${this.apiUrl}/Class`, newClass)
  }

  updateClass(id: number, updatedClass: ClassToSend): Observable<Class> {
    return this.httpClient.put<Class>(`${this.apiUrl}/Class/${id}`, updatedClass);
  }

  deleteClass(id: number): Observable<string> {
    return this.httpClient.delete(`${this.apiUrl}/Class/${id}`, {responseType: 'text'});
  }

  getCoachesByGym(gymId: number): Observable<Coach[]>
  {
    return this.httpClient.get<Coach[]>(`${this.apiUrl}/Coach/${gymId}`);
  }

  getClassTrainees(classId: number) :Observable<Trainee[]>
  {
    return this.httpClient.get<Trainee[]>(`${this.apiUrl}/Class/${classId}/Trainees`);
  }

  addTraineeToClass(classId: number, traineeId: number): Observable<Trainee>
  {
    return this.httpClient.get<Trainee>(`${this.apiUrl}/Class/${classId}/Trainee/${traineeId}`);
  }

  removeTraineeFromClass(classId: number, traineeId: number): Observable<string> {
  return this.httpClient.delete(
    `${this.apiUrl}/Class/${classId}/Trainee/${traineeId}`,
    { responseType: 'text' }
    );
  }

  getClassNotJoinedTrainees(classId: number): Observable<Trainee[]>
  {
    return this.httpClient.get<Trainee[]>(`${this.apiUrl}/Class/${classId}/notJoinedTrainees`);
  }
}
