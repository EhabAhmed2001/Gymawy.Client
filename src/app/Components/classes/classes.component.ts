import { Component, OnInit } from '@angular/core';
import { Class, ClassToSend, Coach } from '../../Interface/Class';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ClassService } from '../../Services/class.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CurrencyPipe, RouterModule, CommonModule, FormsModule, DatePipe],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
  public GymClasses: Class[] = [];
  gymId: number = 0;

  selectedClass: Class = {
    id: 0,
    name: '',
    description: '',
    cost: 0,
    currentCapacity: 0,
    capacity: 0,
    date: new Date(),
    coachName: ''
  };

  newClass: ClassToSend = {
    name: '',
    description: '',
    cost: 0,
    currentCapacity: 0,
    capacity: 0,
    date: new Date(),
    coachId: 0,
    gymId: 0
  };

  updatedClass: ClassToSend = {
    name: '',
    description: '',
    cost: 0,
    currentCapacity: 0,
    capacity: 0,
    date: new Date(),
    coachId: 0,
    gymId: 0
  };

  gymCoaches: Coach[] = [];
  showViewModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showCreateModal = false;
  loading = false;
  deleting = false;
  saving = false;
  creating = false;
  errorMessage: string | null = null;

  constructor(
    private classService: ClassService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.gymId = +params['gymId']; 
      this.loadClasses();
      this.loadCoaches();
    });
  }

  loadClasses(): void {
    this.loading = true;
    this.classService.getClassesByGym(this.gymId).subscribe({
      next: (data: Class[]) => {
        this.GymClasses = data;
        this.loading = false;
      },
      error: (err) => {
        this.handleError(err, 'Failed to load classes');
      }
    });
  }

  loadCoaches(): void {
    this.loading = true;
    this.classService.getCoachesByGym(this.gymId).subscribe({
      next: (data: Coach[]) => {
        this.gymCoaches = data;
        this.loading = false;
      },
      error: (err) => {
        this.handleError(err, 'Failed to load coaches');
      }
    });
  }

  openViewModal(c: Class): void {
    this.selectedClass = { ...c };
    this.showViewModal = true;
    document.body.classList.add('modal-open');
  }

  openEditModal(c: Class): void {
    this.selectedClass = { ...c };
    const coach = this.gymCoaches.find(coach =>
      `${coach.firstName} ${coach.lastName}` === c.coachName
    );

    this.updatedClass = {
      name: c.name,
      description: c.description,
      cost: c.cost,
      currentCapacity: c.currentCapacity,
      capacity: c.capacity,
      date: c.date,
      coachId: coach?.id || 0,
      gymId: this.gymId
    };

    this.showEditModal = true;
    document.body.classList.add('modal-open');
  }

  openDeleteModal(c: Class): void {
    this.selectedClass = { ...c };
    this.showDeleteModal = true;
    document.body.classList.add('modal-open');
  }

  openCreateModal(): void {
    this.newClass = {
      name: '',
      description: '',
      cost: 0,
      currentCapacity: 0,
      capacity: 10,
      date: new Date(),
      coachId: 0,
      gymId: this.gymId
    };
    this.showCreateModal = true;
    document.body.classList.add('modal-open');
  }

  closeViewModal(): void {
    this.showViewModal = false;
    document.body.classList.remove('modal-open');
  }

  closeEditModal(): void {
    this.showEditModal = false;
    document.body.classList.remove('modal-open');
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    document.body.classList.remove('modal-open');
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    document.body.classList.remove('modal-open');
  }

  createClass(form: NgForm): void {
    if (form.invalid) return;

    this.creating = true;
    this.classService.createClass(this.newClass).subscribe({
      next: (createdClass) => {
        this.GymClasses.push(createdClass);
        this.closeCreateModal();
        this.creating = false;
      },
      error: (err) => {
        this.handleError(err, 'Failed to create class');
      }
    });
  }

  updateClass(form: NgForm): void {
    if (form.invalid) return;

    this.saving = true;
    this.classService.updateClass(this.selectedClass.id, this.updatedClass).subscribe({
      next: (updatedClass) => {
        const index = this.GymClasses.findIndex(c => c.id === updatedClass.id);
        if (index !== -1) this.GymClasses[index] = updatedClass;
        this.closeEditModal();
        this.saving = false;
      },
      error: (err) => {
        this.handleError(err, 'Failed to update class');
      }
    });
  }

  deleteClass(): void {
    this.deleting = true;
    this.classService.deleteClass(this.selectedClass.id).subscribe({
      next: () => {
        this.GymClasses = this.GymClasses.filter(c => c.id !== this.selectedClass.id);
        this.closeDeleteModal();
        this.deleting = false;
      },
      error: (err) => {
        this.handleError(err, 'Failed to delete class');
      }
    });
  }

  validateDate(controlName: string, form: NgForm): void {
    const dateValue = controlName === 'date' ? this.newClass.date : this.updatedClass.date;
    const dateControl = form.controls[controlName];

    if (new Date(dateValue).getTime() < Date.now()) {
      dateControl?.setErrors({ 'invalidDate': true });
    } else {
      dateControl?.setErrors(null);
    }
  }

  private handleError(err: any, defaultMessage: string): void {
    console.error(err);
    this.errorMessage = err.error?.message || defaultMessage;
    this.loading = false;
    this.creating = false;
    this.saving = false;
    this.deleting = false;
  }
}
