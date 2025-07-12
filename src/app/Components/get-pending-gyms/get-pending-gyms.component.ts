import { Component, OnInit } from '@angular/core';
import { GymService } from '../../Services/gym.service';
import { PendingGym } from '../../Interfaces/Gym/Gym';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-get-pending-gyms',
  imports: [CommonModule],
  templateUrl: './get-pending-gyms.component.html',
  styleUrl: './get-pending-gyms.component.css'
})
export class GetPendingGymsComponent implements OnInit{
  
  pendingGyms:PendingGym[]=[]

  constructor(private gymservice:GymService,private route:Router){

  }
  ngOnInit(): void {
    this.gymservice.GetPendingGyms().subscribe({
      next:(responce)=>{
        this.pendingGyms = responce
      },
      error:(e)=>{
        console.log(e);
      }
    })
  }
  HandelRequest(gymId:number,isAccept:boolean){
    this.gymservice.HandleGymAddRequest(gymId,isAccept).subscribe({
      next:(res)=>{
         const idx= this.pendingGyms.findIndex(pg=>pg.gymId==res);
         this.pendingGyms.splice(idx,1);
      },
      error:(e)=>{

      }

    })
  }
  GetGymDetails(gymId:number){
    this.route.navigate(['/PendingGymDetails',gymId])
  }
}
