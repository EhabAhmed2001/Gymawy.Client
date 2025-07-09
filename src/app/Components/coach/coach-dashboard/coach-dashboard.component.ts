import { Component, input, OnInit, signal } from '@angular/core';
import { CoachData } from '../../../Interface/Coach/CoachDashboard';
import { CoachService } from '../../../Services/coach.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coach-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './coach-dashboard.component.html',
  styleUrl: './coach-dashboard.component.css'
})
export class CoachDashboardComponent implements OnInit {
  coachId:number = 3;

  initialData = input<CoachData>();


  coachData = signal<CoachData | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private _coachService: CoachService, private route: ActivatedRoute){}
  ngOnInit() {
    this.coachId = Number(this.route.snapshot.paramMap.get('coachId'));

    if (this.initialData()) {
      this.coachData.set(this.initialData()!);
    } else if (this.coachId) {
      this.loadCoachData(this.coachId);
    }
  }

  private loadCoachData(coachId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this._coachService.GetCoachDashboard(coachId).subscribe({
      next: (data) => {
        this.coachData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load dashboard data');
        this.isLoading.set(false);
      }
    });
  }


  retry(): void {
    if (this.coachId) {
      this.loadCoachData(this.coachId);
    }
  }
}
