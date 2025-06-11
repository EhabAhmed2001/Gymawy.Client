import { Injectable } from '@angular/core';
import { GymDetails } from '../Interface/TraineeGym';

@Injectable({
  providedIn: 'root'
})
export class DataSharedService {
  gyms : GymDetails[] = [];

  constructor() { }
}
