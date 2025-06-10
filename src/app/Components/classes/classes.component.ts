import { Component, OnInit } from '@angular/core';
import { Class, ClassToSend, Coach } from '../../Interface/Class';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../Services/class.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CurrencyPipe, RouterModule, CommonModule, FormsModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css'
})
export class ClassesComponent implements OnInit {
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
    coachName: ''
  };

  // New class for creation (if you want to add create functionality later)
  newClass: ClassToSend = {
    name: '',
    description: '',
    cost: 0,
    currentCapacity: 0,
    capacity: 0,
    coachId: 0,
    gymId: 0
  };

  updatedClass: ClassToSend = {
    name: '',
    description: '',
    cost: 0,
    currentCapacity: 0,
    capacity: 0,
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
    this.gymId = +this.router.snapshot.paramMap.get('id')!;
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

  loadCoaches():void {
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
    coachId: coach?.id || 0,
    gymId: this.gymId
  };

  this.showEditModal = true;
  this.errorMessage = null;
}

  openDeleteModal(c: Class): void {
    this.selectedClass = { ...c };
    this.showDeleteModal = true;
    this.errorMessage = null; // Clear any previous errors
  }

  openCreateModal(): void {
    this.newClass = {
      name: '',
      description: '',
      cost: 0,
      currentCapacity: 0,
      capacity: 10,
      coachId: 0,
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
    if (!this.validateClass(this.newClass)) {
      return;
    }

    this.creating = true;
    this.errorMessage = null;

    this.classService.createClass(this.newClass).subscribe({
      next: (createdClass) => {
        this.GymClasses.push(createdClass);
        this.creating = false;
        this.showCreateModal = false;
        this.loadClasses(); // Refresh the list
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
  if (!this.validateClass(this.updatedClass)) {
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
      this.loadClasses(); // Refresh the list
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

    console.log('Attempting to delete class with ID:', this.selectedClass.id);

    this.classService.deleteClass(this.selectedClass.id).subscribe({
      next: (response) => {
        console.log('Delete response:', response);
        console.log('Delete successful!');

        // Remove the item from the local array
        this.GymClasses = this.GymClasses.filter(c => c.id !== this.selectedClass.id);
        this.deleting = false;
        this.showDeleteModal = false;
      },
      error: (err) => {
        console.log('=== DELETE ERROR DETAILS ===');
        console.log('Full error object:', err);
        console.log('Error status:', err.status);
        console.log('Error statusText:', err.statusText);
        console.log('Error message:', err.message);
        console.log('Error body:', err.error);
        console.log('Error headers:', err.headers);
        console.log('============================');

        // Check if it's actually a "successful" error (like 204 No Content)
        if (err.status === 204 || err.status === 200) {
          console.log('Delete was actually successful (status 204/200)');
          // Treat as success
          this.GymClasses = this.GymClasses.filter(c => c.id !== this.selectedClass.id);
          this.deleting = false;
          this.showDeleteModal = false;
          return;
        }

        this.errorMessage = err.error?.message || `Failed to delete class. Status: ${err.status}`;
        this.apiErrorDetails = err.error;
        this.deleting = false;
      }
    });
  }

  private validateClass(c: ClassToSend): boolean {
  if (!c.name || c.name.trim() === '') {
    this.errorMessage = 'Class name is required';
    return false;
  }
  if (!c.coachId || c.coachId <= 0) {
    this.errorMessage = 'Please select a valid coach';
    return false;
  }
  if (c.cost < 0) {
    this.errorMessage = 'Cost cannot be negative';
    return false;
  }
  if (c.capacity <= 0) {
    this.errorMessage = 'Capacity must be greater than 0';
    return false;
  }
  if (c.currentCapacity < 0) {
    this.errorMessage = 'Current capacity cannot be negative';
    return false;
  }
  if (c.currentCapacity > c.capacity) {
    this.errorMessage = 'Current capacity cannot exceed total capacity';
    return false;
  }
  return true;
}
}
