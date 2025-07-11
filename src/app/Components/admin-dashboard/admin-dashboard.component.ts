import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../../Services/admin-dashboard.service';
import { Chart, registerables } from 'chart.js';
import { adminDashboard } from '../../Interface/AdminDashboard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports:[CommonModule]
})
export class AdminDashboardComponent implements OnInit {
  dashboardData!: adminDashboard;
  statsChart: any;
  profitChart: any;

  constructor(private adminDashboardService: AdminDashboardService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.adminDashboardService.getAdminDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.createStatsChart();
        this.createProfitChart();
      },
      error: (err) => console.error('Error fetching dashboard data:', err)
    });
  }

  createStatsChart(): void {
    const ctx = document.getElementById('statsChart') as HTMLCanvasElement;
    this.statsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Gyms', 'Gym Owners', 'Coaches', 'Trainees', 'Pending Gyms'],
        datasets: [{
          label: 'System Statistics',
          data: [
            this.dashboardData.numGyms,
            this.dashboardData.numGymOwners,
            this.dashboardData.numCoaches,
            this.dashboardData.numTrainees,
            this.dashboardData.numPendingGyms
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createProfitChart(): void {
    const labels = this.dashboardData.ownerStatDto.map(owner =>
      `${owner.firstName} ${owner.lastName}`
    );
    const profits = this.dashboardData.ownerStatDto.map(owner => owner.profit);

    const ctx = document.getElementById('profitChart') as HTMLCanvasElement;
    this.profitChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Profit by Gym Owner',
          data: profits,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Profit Distribution by Gym Owner'
          }
        }
      }
    });
  }
}
