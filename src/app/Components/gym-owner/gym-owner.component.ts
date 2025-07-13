// gym-owner.component.ts
import { Component, OnInit } from '@angular/core';
import { GymOwnerService } from '../../Services/gym-owner.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GymBasicInfo } from '../../Interface/GymBasicInfo';
import { CommonModule } from '@angular/common';
import { GymOwnerInfo } from '../../Interface/GymOwnerInfo';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-gym-owner',
  imports: [RouterModule, CommonModule],
  templateUrl: './gym-owner.component.html',
  styleUrls: ['./gym-owner.component.css']
})
export class GymOwnerComponent implements OnInit {
  public ownerId: string = '';
  public gyms: GymBasicInfo[] = [];
  public selectedGymId: number | null = null;
  public ownerInfo: GymOwnerInfo = {
    firstName:'',
    lastName:'',
    email:'',
    userName: '',
    phoneNumber:''
  }
  showProfileDropdown = false;

  constructor(
    private gymOwnerService: GymOwnerService,
    private route: ActivatedRoute,
    private router: Router,
    public _authService:AuthService
  ) {
    this.ownerId = route.snapshot.paramMap.get('id')!;
  }

   logout(): void {
        this._authService.logout();
      }

  ngOnInit(): void {
    console.log("enter");
    console.log(this.ownerId)
    this.gymOwnerService.getGymsForOwner().subscribe({
      
      next: (data: GymBasicInfo[]) => {
            console.log("entersds");

        this.gyms = data;
        if (this.gyms.length > 0) {
          this.selectedGymId = this.gyms[0].id;
        }
                    console.log("dv");

      },
      error:(e)=>{
        console.log("ee");
        console.log(e)
      }
    });

    // this.loadOwnerInfo();
  }

  loadOwnerInfo(): void {
    this.gymOwnerService.getOwnerInfo().subscribe({
      next:(data:any) => {
        this.ownerInfo = data;
        console.log("gymowner")
                console.log(data)

      }
    }
    );
  }

  selectGym(gymId: number): void {
    this.selectedGymId = gymId;
    const currentUrl = this.router.url;

    // Handle different route patterns
    if (currentUrl.includes('/gym/')) {
        // For routes like /gym/:gymId/class or /gym/:gymId/class/:classId/trainees
        const newUrl = currentUrl.replace(/\/gym\/\d+/, `/gym/${gymId}`);
        this.router.navigateByUrl(newUrl);
    } else if (currentUrl.includes('/gymDetail/')) {
        this.router.navigate([`gym-owner/gymDetail/${gymId}`]);
    } else if (currentUrl.includes('/features/')) {
        this.router.navigate([`gym-owner/features/${gymId}`]);
    } else if (currentUrl.includes('/GymPendingCoach/')) {
        this.router.navigate([`gym-owner/GymPendingCoach/${gymId}`]);
    } else if (currentUrl.includes('/createmembership/')) {
        this.router.navigate([`gym-owner/createmembership/${gymId}`]);
    } else if (currentUrl.includes('/memberships/')) {
        this.router.navigate([`gym-owner/memberships/${gymId}`]);
    }// else if (currentUrl.includes('/dashboard/')) {
       // this.router.navigate([`gym-owner/dashboard/${gymId}`]);
    //} 
    else if (currentUrl.includes('/trainess/')) {
        this.router.navigate([`gym-owner/trainess/${gymId}`]);
    } else {
        // Default fallback
        this.router.navigate([`/gym/${gymId}/class`]);
    }
}

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }
}
