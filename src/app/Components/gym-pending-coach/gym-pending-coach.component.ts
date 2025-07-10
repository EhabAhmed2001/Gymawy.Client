import { Component, OnInit } from '@angular/core';
import { CoachService } from '../../Services/coach.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PendingCoach } from '../../Interfaces/Coach';
@Component({
  selector: 'app-gym-pending-coach',
  imports: [CommonModule],
  templateUrl: './gym-pending-coach.component.html',
  styleUrl: './gym-pending-coach.component.css'
})
export class GymPendingCoachComponent implements OnInit {
  gymId!:number
  pendingCoachs:PendingCoach[]=[]
  constructor(private coachService:CoachService , private route:ActivatedRoute){
    this.gymId = Number( route.snapshot.paramMap.get('gymId'))
  }
  ngOnInit(): void {
   
    this.coachService.GetGymPendingCoachs(this.gymId).subscribe({
      next:(responce)=>{
        console.log(responce)
        this.pendingCoachs = responce
      },
      error:(e)=>{
        console.log(e);
      }
    })
  }
  handelJobRequest(coachId:number, isAccept:boolean){
    let JobRequest = {coachId:coachId , isAccepted:isAccept}
    this.coachService.HandleCoachJobRequest(this.gymId,JobRequest).subscribe({
      next:(coachId)=>{
        const idx =this.pendingCoachs.findIndex(pc=>pc.coachId==coachId)
        this.pendingCoachs.splice(idx,1)
      },
      error:()=>{

      }
    })
  }
}
