import { Component, OnInit, ViewChild } from '@angular/core';
import { Class, ClassToSend, Coach } from '../../Interface/Class';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ClassService } from '../../Services/class.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CurrencyPipe, RouterModule, CommonModule, FormsModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css'
})
export class ClassesComponent implements OnInit {
  @ViewChild('createForm') createForm!: NgForm;
  @ViewChild('editForm') editForm!: NgForm;

  public GymClasses: Class[] = [];
  gymId: number = 0;

  // Selected class for operations
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

  // New class for creation
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

  // Modal states
  showViewModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showCreateModal = false;

  // Loading states
  loading = false;
  deleting = false;
  saving = false;
  creating = false;

  // Error handling
  errorMessage: string | null = null;
  apiErrorDetails: any = null;

  constructor(
    private classService: ClassService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.gymId = +this.router.snapshot.paramMap.get('gymId')!;
    this.loadClasses();
    this.loadCoaches();
  }

  loadClasses(): void {
    this.loading = true;
    this.errorMessage = null;
    this.classService.getClassesByGym(this.gymId).subscribe({
      next: (data: Class[]) => {
        this.GymClasses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading classes:', err);
        this.errorMessage = 'Failed to load classes. Please try again later.';
        this.apiErrorDetails = err.error;
        this.loading = false;
      }
    });
  }

  loadCoaches(): void {
    this.loading = true;
    this.errorMessage = null;
    this.classService.getCoachesByGym(this.gymId).subscribe({
      next: (data: Coach[]) => {
        this.gymCoaches = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading Coaches:', err);
        this.errorMessage = 'Failed to load coaches. Please try again later.';
        this.apiErrorDetails = err.error;
        this.loading = false;
      }
    });
  }

  // Modal operations
  openViewModal(c: Class): void {
    this.selectedClass = { ...c };
    this.showViewModal = true;
  }

  openEditModal(c: Class): void {
    this.selectedClass = { ...c };

    // Find the coach by name to get the ID
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
    this.errorMessage = null;
  }

  openDeleteModal(c: Class): void {
    this.selectedClass = { ...c };
    this.showDeleteModal = true;
    this.errorMessage = null;
  }

  openCreateModal(): void {
    this.newClass = {
      name: '',
      description: '',
      cost: 0,
      currentCapacity: 0,
      capacity: 10,
      date: new Date(Date.now()),
      coachId: null,
      gymId: this.gymId
    };
    this.showCreateModal = true;
    this.errorMessage = null;
  }

  // Modal close handlers
  closeViewModal(): void {
    this.showViewModal = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.errorMessage = null;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.errorMessage = null;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.errorMessage = null;
  }

  // CRUD operations
  createClass(): void {
    // Mark all fields as touched to show validation messages
    if (this.createForm) {
      Object.keys(this.createForm.controls).forEach(field => {
        const control = this.createForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    }

    // Check if form is valid
    if (this.createForm.invalid) {
      return;
    }

    // Additional validation for date
    if (new Date(this.newClass.date).getTime() < Date.now()) {
      this.createForm.controls['date'].setErrors({ 'invalidDate': true });
      return;
    }

    // Check capacity
    if (this.newClass.currentCapacity > this.newClass.capacity) {
      this.createForm.controls['currentCapacity'].setErrors({ 'capacityExceeded': true });
      this.errorMessage = 'Current capacity cannot exceed total capacity';
      return;
    }

    this.creating = true;
    this.errorMessage = null;

    this.classService.createClass(this.newClass).subscribe({
      next: (createdClass) => {
        this.GymClasses.push(createdClass);
        this.creating = false;
        this.showCreateModal = false;
        this.loadClasses();
      },
      error: (err) => {
        console.error('Error creating class:', err);
        this.errorMessage = err.error?.message || 'Failed to create class. Please try again.';
        this.apiErrorDetails = err.error;
        this.creating = false;
      }
    });
  }

  updateClass(): void {
    // Mark all fields as touched to show validation messages
    if (this.editForm) {
      Object.keys(this.editForm.controls).forEach(field => {
        const control = this.editForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    }

    // Check if form is valid
    if (this.editForm.invalid) {
      return;
    }

    // Additional validation for date
    if (new Date(this.updatedClass.date).getTime() < Date.now()) {
      this.editForm.controls['date'].setErrors({ 'invalidDate': true });
      return;
    }

    // Check capacity
    if (this.updatedClass.currentCapacity > this.updatedClass.capacity) {
      this.editForm.controls['currentCapacity'].setErrors({ 'capacityExceeded': true });
      this.errorMessage = 'Current capacity cannot exceed total capacity';
      return;
    }

    this.saving = true;
    this.errorMessage = null;

    this.classService.updateClass(this.selectedClass.id, this.updatedClass).subscribe({
      next: (updatedClass) => {
        const index = this.GymClasses.findIndex(c => c.id === updatedClass.id);
        if (index !== -1) {
          this.GymClasses[index] = updatedClass;
        }
        this.saving = false;
        this.showEditModal = false;
        this.loadClasses();
      },
      error: (err) => {
        console.error('Error updating class:', err);
        this.errorMessage = err.error?.message || 'Failed to update class. Please try again.';
        this.apiErrorDetails = err.error;
        this.saving = false;
      }
    });
  }

  deleteClass(): void {
    this.deleting = true;
    this.errorMessage = null;

    this.classService.deleteClass(this.selectedClass.id).subscribe({
      next: () => {
        this.GymClasses = this.GymClasses.filter(c => c.id !== this.selectedClass.id);
        this.deleting = false;
        this.showDeleteModal = false;
        this.loadClasses();
        this.loadCoaches();
      },
      error: (err) => {
        console.error('Error deleting class:', err);
        this.errorMessage = err.error?.message || 'Failed to delete class. Please try again.';
        this.apiErrorDetails = err.error;
        this.deleting = false;
      }
    });
  }

  validateDate(): void {
    const dateControl = this.createForm.controls['date'];
    if (new Date(this.newClass.date).getTime() < Date.now()) {
      dateControl.setErrors({ 'invalidDate': true });
    } else {
      dateControl.setErrors(null);
    }
  }

  validateEditDate(): void {
    const dateControl = this.editForm.controls['date'];
    if (new Date(this.updatedClass.date).getTime() < Date.now()) {
      dateControl.setErrors({ 'invalidDate': true });
    } else {
      dateControl.setErrors(null);
    }
  }
}
