import { Component, OnInit  } from '@angular/core';
import { GymService } from '../../Services/gym.service';
import { Router } from '@angular/router';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DisplayMemberShips } from '../../Interface/Gym/Membership';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-gym-member-ships',
  imports: [
    CommonModule,
    NgFor,FormsModule,
    RouterModule
  ],
  templateUrl: './gym-member-ships.component.html',
  styleUrl: './gym-member-ships.component.css'
})
export class GymMemberShipsComponent implements OnInit{
gymId:number=0
errorMessage:string=''
 public Memberships:DisplayMemberShips[]=[]
featurecount:number=0
// In your component class
showModal: boolean = false;
Membershipdetails: DisplayMemberShips | null = null;
constructor(private gymserv:GymService,private router:ActivatedRoute,private routerNav: Router
)
{}
 ngOnInit(): void {
   this.router.params.subscribe(params => {
      this.gymId = +params['id'];
      this.displayMemberships(this.gymId);
    });
  }

  getModifiedUrl(): string {
    // Get the current URL segments
    const urlTree = this.routerNav.parseUrl(this.routerNav.url);
    const segments = urlTree.root.children['primary']?.segments || [];

    // Remove the last two segments
    const modifiedSegments = segments.slice(0, -2);

    // Reconstruct the URL
    const newUrl = modifiedSegments.map(segment => segment.path).join('/');

    return newUrl;
  }

  displayMemberships(Id:number)
  {
    this.gymserv.getmembershipsByGym(Id).subscribe
    ({
      next:(data: DisplayMemberShips[]) => {
                      this.Memberships = data;
                      
      this.featurenumber()
               },

        error: (err) => {
        console.error('Error loading classes:', err);
        this.errorMessage = 'Failed to load classes. Please try again later.';
      }
    })

  }
 public featurenumber(): void {
  this.featurecount = 0;

  this.Memberships.forEach(element => {
    console.log(element)
      const featuresLength = element.features ? element.features.length : 0;
      this.featurecount += featuresLength;
    });
}

editMembership(memberId: number) {
  this.routerNav.navigate(['/gym-owner/EditMembership', memberId]);
}
  showDeleteModal = false;
  memberToDelete: number | null = null;
 openDeleteModal(memberId: number) {
    this.memberToDelete = memberId;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.memberToDelete = null;
  }

  confirmDelete() {
    if (this.memberToDelete !== null) {
      this.gymserv.deleteMembership(this.memberToDelete).subscribe({
        next: () => {
          // Handle successful deletion
          console.log('Membership deleted successfully');
          this.closeDeleteModal();
          window.location.reload();
          // Refresh your data or update UI as needed
        },
        error: (err) => {
          console.error('Error deleting membership:', err);
          // Handle error (you might want to show an error message)
        }
      });
    }
  }




viewDetails(memberid: number) {
  console.log('Button clicked, fetching ID:', memberid); // Debug 1

  this.gymserv.getmebershipbyid(memberid).subscribe({
    next: (data) => {
      console.log('Received data:', data); // Debug 2
      this.Membershipdetails = data;
      this.showModal = true;
      console.log('Modal should be visible. showModal:', this.showModal); // Debug 3
      document.body.style.overflow = 'hidden';
    },
    error: (err) => {
      console.error('Error:', err);
    }
  });
}

closeModal() {
  this.showModal = false;
  document.body.style.overflow = 'auto';
}
}



