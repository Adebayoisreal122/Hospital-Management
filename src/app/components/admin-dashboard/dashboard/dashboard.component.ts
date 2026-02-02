import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  adminName: string = '';
  adminEmail: string = '';
  adminRole: string = '';

  // Dashboard statistics
  totalDoctors: number = 0;
  totalPatients: number = 0;
  totalAppointments: number = 0;
  pendingAppointments: number = 0;
  loading: boolean = true;

  // Recent data
  recentAppointments: any[] = [];

  constructor(
    public router: Router, 
    private toastr: ToastrService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    const adminData = localStorage.getItem('admin');

    if (adminData) {
      const parsed = JSON.parse(adminData);
      this.adminName = parsed.name || 'Admin';
      this.adminEmail = parsed.email || 'No email';
      this.adminRole = parsed.role || 'admin';
      
      // Load dashboard statistics
      this.loadDashboardStats();
    } else {
      this.router.navigate(['/admin-login']);
    }
  }

  loadDashboardStats() {
    this.loading = true;

    this.api.getAdminDashboardStats()
      .then((res: any) => {
        console.log('Admin Dashboard Stats:', res.data);
        
        if (res.data.status) {
          const data = res.data.data;
          this.totalDoctors = data.total_doctors || 0;
          this.totalPatients = data.total_patients || 0;
          this.totalAppointments = data.total_appointments || 0;
          this.pendingAppointments = data.pending_appointments || 0;
          this.recentAppointments = data.recent_appointments || [];
        }
      })
      .catch((error) => {
        console.error('Dashboard Error:', error);
        this.toastr.error('Failed to load dashboard statistics');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  logout(): void {
    localStorage.removeItem('admin');
    sessionStorage.clear();
    this.toastr.success('Log out successful');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}