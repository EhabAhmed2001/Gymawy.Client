import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IUser } from '../Interfaces/IUser';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl:string = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private _httpclient: HttpClient , private _presenceService:PresenceService) { }

  setLogin(formData: FormGroup):Observable<IUser>{
    return this._httpclient.post<IUser>(`${this.baseUrl}/account/login`,formData).pipe(
      tap((user:IUser)=>{
        if(user)
          this.setCurrentUser(user);
      })


    );
  }


setRegister(formData:FormGroup):Observable<IUser>{
    return this._httpclient.post<IUser>(`${this.baseUrl}/account/register`,formData).pipe(
      tap((user:IUser)=>{
        if(user)
          this.setCurrentUser(user);
      })
    )
  }



  setAdminRegister(formData:FormGroup):Observable<IUser>{
    return this._httpclient.post<IUser>(`${this.baseUrl}/account/register/admin`,formData).pipe(
      tap((user:IUser)=>{
        if(user)
          this.setCurrentUser(user);
      })
    )
  }

    setCoachRegister(formData:FormGroup):Observable<IUser>{
    return this._httpclient.post<IUser>(`${this.baseUrl}/account/register/coach`,formData).pipe(
      tap((user:IUser)=>{
        if(user)
          this.setCurrentUser(user);
      })
    )
  }

  setTraineeRegister(formData:FormGroup):Observable<IUser>{
    return this._httpclient.post<IUser>(`${this.baseUrl}/account/register/trainee`,formData).pipe(
      tap((user:IUser)=>{
        if(user)
          this.setCurrentUser(user);
      })
    )
  }

  setCurrentUser(user:IUser):void{
    localStorage.setItem("user",JSON.stringify(user));
    this.currentUserSource.next(user);
    this._presenceService.createHubConnection(user);
  }


  logout():void{
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this._presenceService.stopHubConnection();

  }

}
