import { Component, OnInit } from '@angular/core';
import { ClassService } from '../../Services/class.service';
import { Trainee } from '../../Interface/Class';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-class-trainees',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, DatePipe],
  templateUrl: './class-trainees.component.html',
  styleUrls: ['./class-trainees.component.css']
})
export class ClassTraineesComponent implements OnInit {
  public Trainees: Trainee[] = [];
  public notJoinedTrainees: Trainee[] = [];
  classId: number = 0;
  gymId: number = 0;
  errorMessage: string | null = null;

  selectedTrainee: Trainee | null = null;
  selectedTraineeId: number | null = null;

  // Loading states
  loading = false;
  adding = false;
  removing = false;

  // Modal states
  showAddModal = false;
  showRemoveModal = false;

  constructor(
    private classService: ClassService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.classId = +this.route.snapshot.paramMap.get('classId')!;
    this.gymId = +this.route.snapshot.paramMap.get('gymId')!;
    this.loadTrainees();
    this.loadNotJoinedTrainees();
  }

  loadTrainees(): void {
    this.loading = true;
    this.errorMessage = null;
    this.classService.getClassTrainees(this.classId).subscribe({
      next: (data: Trainee[]) => {
        this.Trainees = data;
        this.loading = false;
      },
      error: (err) => {
        this.handleError(err, 'Failed to load class trainees');
      }
    });
  }

  loadNotJoinedTrainees(): void {
    this.loading = true;
    this.errorMessage = null;
    this.classService.getClassNotJoinedTrainees(this.classId).subscribe({
      next: (data: Trainee[]) => {
        this.notJoinedTrainees = data;
        this.loading = false;
      },
      error: (err) => {
        this.handleError(err, 'Failed to load available trainees');
      }
    });
  }

  // Modal handlers
  openAddTraineeModal(): void {
    this.selectedTraineeId = null;
    this.showAddModal = true;
    document.body.classList.add('modal-open');
  }

  openRemoveModal(trainee: Trainee): void {
    this.selectedTrainee = { ...trainee };
    this.showRemoveModal = true;
    document.body.classList.add('modal-open');
  }

  closeAddModal(): void {
    this.showAddModal = false;
    document.body.classList.remove('modal-open');
  }

  closeRemoveModal(): void {
    this.showRemoveModal = false;
    document.body.classList.remove('modal-open');
  }

  // Actions
  addTrainee(): void {
    if (!this.selectedTraineeId) return;
    
    this.adding = true;
    this.errorMessage = null;
    this.classService.addTraineeToClass(this.classId, this.selectedTraineeId).subscribe({
      next: () => {
        this.loadTrainees();
        this.loadNotJoinedTrainees();
        this.closeAddModal();
        this.adding = false;
      },
      error: (err) => {
        this.handleError(err, 'Failed to add trainee to class');
      }
    });
  }

  removeTrainee(): void {
    if (!this.selectedTrainee) return;
    
    this.removing = true;
    this.errorMessage = null;
    this.classService.removeTraineeFromClass(this.classId, this.selectedTrainee.id).subscribe({
      next: () => {
        this.loadTrainees();
        this.loadNotJoinedTrainees();
        this.closeRemoveModal();
        this.removing = false;
      },
      error: (err) => {
        this.handleError(err, 'Failed to remove trainee from class');
      }
    });
  }

  private handleError(err: any, defaultMessage: string): void {
    console.error(err);
    this.errorMessage = err.error?.message || defaultMessage;
    this.loading = false;
    this.adding = false;
    this.removing = false;
  }
}