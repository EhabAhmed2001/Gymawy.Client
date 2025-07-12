import { Component, OnInit } from '@angular/core';
import { GymOwnerService } from '../../Services/gym-owner.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GymOwnerInfo } from '../../Interface/GymOwnerInfo';

@Component({
  selector: 'app-gym-owner-profile',
  imports: [CommonModule],
  templateUrl: './gym-owner-profile.component.html',
  styleUrl: './gym-owner-profile.component.css'
})
export class GymOwnerProfileComponent implements OnInit {
  ownerId: string = '';
  ownerInfo: GymOwnerInfo | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private ownerService: GymOwnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
          this.loadOwnerData();
    // Get the parent route's ID parameter
    // this.route.parent?.paramMap.subscribe(params => {
    //   this.ownerId = params.get('id')!;

    // });
  }

  private loadOwnerData(): void {
    // if (!this.ownerId) return;

    this.ownerService.getOwnerInfo().subscribe({
      next: (data) => {
        this.ownerInfo = data;
        this.isLoading = false;
        console.log(data);
      }, 
      error: (err) => {
        this.errorMessage = 'Failed to load owner information';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
