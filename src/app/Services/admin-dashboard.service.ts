import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { adminDashboard } from '../Interface/AdminDashboard';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService{
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  getAdminDashboard():Observable<adminDashboard>
  {
    return this.httpClient.get<adminDashboard>(`${this.apiUrl}/Admin/Dashboard`);
  }
}
