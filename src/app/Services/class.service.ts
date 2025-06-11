import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Class, ClassToSend, Coach } from '../Interface/Class';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = 'https://localhost:5001/api';

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

  deleteClass(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/Class/${id}`);
  }

  getCoachesByGym(gymId: number): Observable<Coach[]>
  {
    return this.httpClient.get<Coach[]>(`${this.apiUrl}/Coach/${gymId}`);
  }
}
