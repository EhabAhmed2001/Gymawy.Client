import { Injectable } from '@angular/core';
import { GymDetails } from '../Interface/TraineeGym';

@Injectable({
  providedIn: 'any'
})
export class DataSharedService {
  gyms : GymDetails[] = [];

  constructor() { }
}
