import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { GymOwnerService } from '../Services/gym-owner.service';
import { GymownerData, GymOwnerMembership } from '../Interfaces/GymOwnerData';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// 1. استيراد Chart.js يدوياً
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  DoughnutController
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  DoughnutController
);

@Component({
  selector: 'app-gym-owner-dashboard',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './gym-owner-dashboard.component.html',
  styleUrls: ['./gym-owner-dashboard.component.css']
})
export class GymOwnerDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  GymOwner: number = 1;
  errorMessage = '';
  
  public allGymsData: GymownerData[] = [];
  public allGymsMemberships: GymOwnerMembership[] = [];
  
  private overviewChart: Chart | null = null;
  private membershipChart: Chart | null = null;
  private comparisonChart: Chart | null = null;

  private colorScheme = {
    primary: ['#667eea', '#764ba2', '#4facfe', '#00f2fe', '#ff6b6b', '#ffeaa7', '#fd79a8', '#6c5ce7', '#a29bfe', '#74b9ff'],
    secondary: ['#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#ffeaa7', '#fd79a8', '#6c5ce7', '#a29bfe', '#74b9ff', '#55a3ff'],
    gradient: [
      'rgba(102, 126, 234, 0.8)',
      'rgba(118, 75, 162, 0.8)',
      'rgba(79, 172, 254, 0.8)',
      'rgba(0, 242, 254, 0.8)',
      'rgba(255, 107, 107, 0.8)',
      'rgba(255, 234, 167, 0.8)',
      'rgba(253, 121, 168, 0.8)',
      'rgba(108, 92, 231, 0.8)',
      'rgba(162, 155, 254, 0.8)',
      'rgba(116, 185, 255, 0.8)'
    ]
  };

  constructor(
    private gserv: GymOwnerService,
    private router: ActivatedRoute,
    private routerNav: Router
  ) {}

  ngOnInit(): void {
          this.GymOwner = +this.router.snapshot.params['id'];
      this.loadAllGymsData(this.GymOwner);
    // this.router.params.subscribe(params => {
    //   this.GymOwner = +params['id'];
    //   this.loadAllGymsData(this.GymOwner);
    // });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChartsIfDataExists();
    }, 100);
  }

  private loadAllGymsData(id:number): void {
    this.getAllGymsData(id);
   this.getAllGymsMemberships(id);
  }

  private createChartsIfDataExists(): void {
    if (this.allGymsData.length > 0) {
      this.createOverviewChart();
      this.createComparisonChart();
    }
    if (this.allGymsMemberships.length > 0) {
      this.createMembershipChart();
    }
  }

  // New method to get all gyms data
  getAllGymsData(id:number) {
    this.gserv.getGymownerData(id).subscribe({
      next: (data: GymownerData[]) => {
        this.allGymsData = data;
        setTimeout(() => {
          this.createOverviewChart();
          this.createComparisonChart();
        }, 100);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load gyms data. Please try again later.';
      }
    });
  }

  // New method to get all gyms memberships
  getAllGymsMemberships(id:number) {
    this.gserv.getGymownerMembership(id).subscribe({
      next: (data: GymOwnerMembership[]) => {
        this.allGymsMemberships = data;
        setTimeout(() => {
          this.createMembershipChart();
        }, 100);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load memberships data. Please try again later.';
      }
    });
  }

  private createOverviewChart(): void {
    if (this.allGymsData.length === 0) return;

    const ctx = document.getElementById('overviewChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.overviewChart) {
      this.overviewChart.destroy();
    }

    const gymNames = this.allGymsData.map(gym => gym.name);
    
    this.overviewChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: gymNames,
        datasets: [
          {
            label: 'Memberships',
            data: this.allGymsData.map(gym => gym.membershipsCount),
            backgroundColor: this.colorScheme.gradient[0],
            borderColor: this.colorScheme.primary[0],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Coaches',
            data: this.allGymsData.map(gym => gym.coachesCount),
            backgroundColor: this.colorScheme.gradient[1],
            borderColor: this.colorScheme.primary[1],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Trainees',
            data: this.allGymsData.map(gym => gym.traineesCount),
            backgroundColor: this.colorScheme.gradient[2],
            borderColor: this.colorScheme.primary[2],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Classes',
            data: this.allGymsData.map(gym => gym.classesCount),
            backgroundColor: this.colorScheme.gradient[3],
            borderColor: this.colorScheme.primary[3],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'All Gyms - Overview Statistics',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#333'
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#667eea',
            borderWidth: 1
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: '#666'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#666',
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });
  }

  private createMembershipChart(): void {
    if (this.allGymsMemberships.length === 0) return;

    const ctx = document.getElementById('membershipChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.membershipChart) {
      this.membershipChart.destroy();
    }

    // Group memberships by type and sum trainees
    const membershipGroups = this.allGymsMemberships.reduce((acc, membership) => {
      const key = membership.membershipName;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += membership.traineesCount;
      return acc;
    }, {} as { [key: string]: number });

    const membershipNames = Object.keys(membershipGroups);
    const membershipCounts = Object.values(membershipGroups);

    this.membershipChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: membershipNames,
        datasets: [{
          label: 'Trainees',
          data: membershipCounts,
          backgroundColor: this.colorScheme.gradient.slice(0, membershipNames.length),
          borderColor: this.colorScheme.primary.slice(0, membershipNames.length),
          borderWidth: 3,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'All Gyms - Membership Distribution',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#333'
          },
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#667eea',
            borderWidth: 1,
            callbacks: {
              label: function(context: any) {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((context.parsed * 100) / total).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  private createComparisonChart(): void {
    if (this.allGymsData.length === 0) return;

    const ctx = document.getElementById('comparisonChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.comparisonChart) {
      this.comparisonChart.destroy();
    }

    // Calculate totals across all gyms
    const totals = this.allGymsData.reduce((acc, gym) => {
      acc.trainees += gym.traineesCount;
      acc.coaches += gym.coachesCount;
      acc.classes += gym.classesCount;
      return acc;
    }, { trainees: 0, coaches: 0, classes: 0 });
    
    this.comparisonChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Total Trainees', 'Total Coaches', 'Total Classes'],
        datasets: [{
          label: 'Distribution',
          data: [
            totals.trainees,
            totals.coaches,
            totals.classes
          ],
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(255, 107, 107, 0.8)',
            'rgba(79, 172, 254, 0.8)'
          ],
          borderColor: [
            '#667eea',
            '#ff6b6b',
            '#4facfe'
          ],
          borderWidth: 3,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'All Gyms - Total Composition',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#333'
          },
          legend: {
            position: 'right',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#667eea',
            borderWidth: 1,
            callbacks: {
              label: function(context: any) {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((context.parsed * 100) / total).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.overviewChart) {
      this.overviewChart.destroy();
    }
    if (this.membershipChart) {
      this.membershipChart.destroy();
    }
    if (this.comparisonChart) {
      this.comparisonChart.destroy();
    }
  }
}