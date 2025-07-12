// gym-owner.component.ts
import { Component, OnInit } from '@angular/core';
import { GymOwnerService } from '../../Services/gym-owner.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GymBasicInfo } from '../../Interface/GymBasicInfo';
import { CommonModule } from '@angular/common';
import { GymOwnerInfo } from '../../Interface/GymOwnerInfo';

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
    private router: Router
  ) {
    this.ownerId = route.snapshot.paramMap.get('id')!;
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
      }
    }
    );
  }

  selectGym(gymId: number): void {
    this.selectedGymId = gymId;

    const currentUrl = this.router.url;

    // Extract the feature part from the URL (e.g., 'class' from '/gym-owner/1/gym/1/class')
    const urlParts = currentUrl.split('/');
    const feature = urlParts[urlParts.length - 1]; // gets the last part

    this.router.navigate([`/gym-owner/1/gym/${gymId}/${feature}`]);
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  logout(): void {
    console.log('Logging out...');
  }
}
