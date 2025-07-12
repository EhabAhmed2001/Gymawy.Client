
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Features, MemberShip ,DisplayMemberShips} from '../Interface/Gym/Membership';

@Injectable({
  providedIn: 'root'
})
export class GymService {

  private url='http://localhost:5000/api'
  constructor(private httpClient: HttpClient) { }

   getFeaturesByGymID(gymid :number):Observable<Features[]>
   {
      return this.httpClient.get<Features[]>(`${this.url}/Gym/${gymid}`);
   }

 createMemberShip(membership: MemberShip): Observable<{ message: string }> {
  return this.httpClient.post<{ message: string }>(
    `${this.url}/Gym/MemberShip`,
    membership
  );
}

getmembershipsByGym(gymId:number):Observable<DisplayMemberShips[]>
{
      return this.httpClient.get<DisplayMemberShips[]>(`${this.url}/Gym/GetmMemberShips/${gymId}`);

}

getmebershipbyid(memberid:number):Observable<DisplayMemberShips>
{
return this.httpClient.get<DisplayMemberShips>(`${this.url}/Gym/GetmMemberShip/${memberid}`);
}


deleteMembership(memberId: number): Observable<any> {
    return this.httpClient.delete(`${this.url}/Gym/DeleteMemberShip/${memberId}`);
  }

updateMembership(memberId:number,membership: MemberShip):Observable<{ message: string }>
{
 return this.httpClient.put<{ message: string }>(
    `${this.url}/Gym/UpdateMemberShip/${memberId}`,
    membership
  );}

}
