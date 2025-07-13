import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GymClasses, GymFeatures, GymMembership, GymDetails, TraineeCoachDetails, TraineeSubscription, TraineeDiet, TraineeExerciseSchedule, TraineeInfo, EditTraineeProfileDto } from '../Interface/TraineeGym';
import { Observable } from 'rxjs/internal/Observable';
import { PaymentReturn } from '../Interfaces/Payment/PaymentReturn';
import { Trainee,AssignCoachTrainee} from '../Interface/Trainee';
import { ITraineeInfo } from '../Interfaces/ITraineeInfo';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TraineeService {

  private apiUrl = `${environment.apiUrl}/Trainee`;
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

AssignCoachtoTrainee(data:AssignCoachTrainee)
{
  return this.httpClient.post<{ message: string }>(
    `${this.apiUrl}/AssignCoachToTrainee`,
    data
  );
}
getTraineeByUserName(username:string): Observable<ITraineeInfo> {
  return this.httpClient.get<ITraineeInfo>(`${this.baseUrl}/trainee/${username}`);
}

// TraineeData

GetTraineeData(): Observable<TraineeInfo> {
  return this.httpClient.get<TraineeInfo>(`${this.apiUrl}/profile`);
}

// updateProfile(profileData: EditTraineeProfileDto): Observable<TraineeInfo> {
//     // Create FormData for file upload support
//     const formData = new FormData();

//     // Append all properties from the DTO
//     Object.keys(profileData).forEach(key => {
//       const value = profileData[key as keyof EditTraineeProfileDto];
//       if (value !== null && value !== undefined) {
//         // Handle nested address object
//         if (key === 'address' && typeof value === 'object') {
//           Object.keys(value).forEach(addressKey => {
//             const addressValue = value[addressKey as keyof typeof value];
//             if (addressValue !== null && addressValue !== undefined) {
//               formData.append(`address.${addressKey}`, addressValue);
//             }
//           });
//         } 
//         // Handle file upload
//         else if (key === 'image' && value instanceof File) {
//           formData.append(key, value, value.name);
//         }
//         // Handle regular fields
//         else {
//           formData.append(key, value.toString());
//         }
//       }
//     });

 
//     return this.httpClient.put<TraineeInfo>(`${this.apiUrl}/update-profile`, formData, {
//       reportProgress: true, // For tracking file upload progress
//       observe: 'response' // To get full HTTP response
//     }).pipe(
//       map(response => response.body as TraineeInfo)
//     );
//   }

updateProfile(profileData: EditTraineeProfileDto): Observable<TraineeInfo> {
  const formData = new FormData();

  // Append simple properties
  if (profileData.firstName) formData.append('FirstName', profileData.firstName);
  if (profileData.lastName) formData.append('LastName', profileData.lastName);
  if (profileData.dateOfBirth) formData.append('DateOfBirth', profileData.dateOfBirth.toString());
  if (profileData.phoneNumber) formData.append('PhoneNumber', profileData.phoneNumber);
  if (profileData.reasonForJoining) formData.append('ReasonForJoining', profileData.reasonForJoining);
  if (profileData.weight) formData.append('Weight', profileData.weight.toString());

  // Only append image if it's a new File object
  if (profileData.image instanceof File) {
    formData.append('Image', profileData.image, profileData.image.name);
  } else {
    // Explicitly send null when no image is selected
    formData.append('Image', 'null'); // Or omit this line if your backend handles missing field as null
  }

  // Append address object if exists
  if (profileData.address) {
    formData.append('Address.Street', profileData.address.street || '');
    formData.append('Address.City', profileData.address.city || '');
    formData.append('Address.Country', profileData.address.country || '');
  }

  return this.httpClient.put<TraineeInfo>(`${this.apiUrl}/update-profile`, formData, {
    reportProgress: true
  });
}

}
