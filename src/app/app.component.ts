import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MapComponent } from './Components/map/map.component';
import { AddGymComponent } from "./Components/add-gym/add-gym.component";
import { HttpClient } from '@angular/common/http';
import { AuthService } from './Services/auth.service';
import { IUser } from './Interfaces/IUser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule, MapComponent, AddGymComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'GymManagement';

  constructor(private _httpClient: HttpClient , private _authService:AuthService) {}

  ngOnInit(): void {
  //  this.getUsers();
   this.setCurrentUser();
  }


  setCurrentUser():void{
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user:IUser = JSON.parse(userString);
    this._authService.setCurrentUser(user);

  }
}
