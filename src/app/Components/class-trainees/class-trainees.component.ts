import { Component, OnInit } from '@angular/core';
import { ClassService } from '../../Services/class.service';
import { Trainee } from '../../Interface/Class';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-class-trainees',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './class-trainees.component.html',
  styleUrls: ['./class-trainees.component.css']
})
export class ClassTraineesComponent implements OnInit {
  Trainees: Trainee[] = [];
  notJoinedTrainees: Trainee[] = [];
  classId: number = 0;
  selectedTraineeId: number | null = null;
  selectedTrainee: Trainee | null = null;
  loading = false;
  adding = false;
  removing = false;

  // Modal states
  showAddModal = false;
  showRemoveModal = false;

  constructor(
    private classService: ClassService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.classId = +this.router.snapshot.paramMap.get('classId')!;
    this.loadTrainees();
    this.loadNotJoinedTrainees();
  }

  loadTrainees() {
    this.loading = true;
    this.classService.getClassTrainees(this.classId).subscribe({
      next: (data) => {
        this.Trainees = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading trainees:', error);
        this.loading = false;
      }
    });
  }

  loadNotJoinedTrainees() {
    this.loading = true;
    this.classService.getClassNotJoinedTrainees(this.classId).subscribe({
      next: (data) => {
        this.notJoinedTrainees = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading available trainees:', error);
        this.loading = false;
      }
    });
  }

  // Modal handlers
  openAddTraineeModal() {
    this.showAddModal = true;
    this.selectedTraineeId = null;
    document.body.classList.add('modal-open');
  }

  openRemoveModal(trainee: Trainee) {
    this.selectedTrainee = trainee;
    this.showRemoveModal = true;
    document.body.classList.add('modal-open');
  }

  closeAddModal() {
    this.showAddModal = false;
    document.body.classList.remove('modal-open');
  }

  closeRemoveModal() {
    this.showRemoveModal = false;
    document.body.classList.remove('modal-open');
  }

  // Actions
  addTrainee() {
    if (this.selectedTraineeId) {
      this.adding = true;
      this.classService.addTraineeToClass(this.classId, this.selectedTraineeId).subscribe({
        next: () => {
          this.loadTrainees();
          this.loadNotJoinedTrainees();
          this.adding = false;
          this.closeAddModal();
        },
        error: (error) => {
          console.error('Error adding trainee:', error);
          this.adding = false;
        }
      });
    }
  }

  removeTrainee() {
    if (this.selectedTrainee) {
      this.removing = true;
      this.classService.removeTraineeFromClass(this.classId, this.selectedTrainee.id)
        .subscribe({
          next: () => {
            this.loadTrainees();
            this.loadNotJoinedTrainees();
            this.removing = false;
            this.closeRemoveModal();
          },
          error: (error) => {
            console.error('Error removing trainee:', error);
            this.removing = false;
          }
        });
    }
  }
}