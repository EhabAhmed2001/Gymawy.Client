// gym-owner.component.ts
import { Component, OnInit } from '@angular/core';
import { GymOwnerService } from '../../Services/gym-owner.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GymBasicInfo } from '../../Interface/GymBasicInfo';
import { CommonModule } from '@angular/common';

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

  constructor(
    private gymOwnerService: GymOwnerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.ownerId = route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.gymOwnerService.getGymsForOwner(+this.ownerId).subscribe({
      next: (data: GymBasicInfo[]) => {
        this.gyms = data;
        if (this.gyms.length > 0) {
          this.selectedGymId = this.gyms[0].id;
        }
      }
    });
  }

  selectGym(gymId: number): void {
    this.selectedGymId = gymId;

    const currentUrl = this.router.url;

    // Extract the feature part from the URL (e.g., 'class' from '/gym-owner/1/gym/1/class')
    const urlParts = currentUrl.split('/');
    const feature = urlParts[urlParts.length - 1]; // gets the last part

    this.router.navigate([`/gym-owner/1/gym/${gymId}/${feature}`]);
  }

  openAddGymModal(): void {
    // Implement modal opening logic
    console.log('Opening add gym modal');
  }

  openEditGymModal(): void {
    // Implement edit modal opening logic
    console.log('Opening edit gym modal for gym:', this.selectedGymId);
  }

  confirmDeleteGym(): void {
    if (confirm('Are you sure you want to delete this gym?')) {
      // Implement delete logic
      console.log('Deleting gym:', this.selectedGymId);
    }
  }
}
