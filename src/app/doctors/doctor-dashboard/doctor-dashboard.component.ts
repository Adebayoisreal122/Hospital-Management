import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
  doctorName: string = '';
  doctorEmail: string = '';
  doctorSpecialization: string = '';
  doctorId: number = 0;

  // Dashboard statistics
  totalPatients: number = 0;
  upcomingAppointments: number = 0;
  completedConsultations: number = 0;
  pendingAppointments: number = 0;
  loading: boolean = true;

  constructor(
    public router: Router,
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get doctor data from localStorage
    const doctorData = localStorage.getItem('doctor');

    if (doctorData) {
      const parsed = JSON.parse(doctorData);
      this.doctorName = parsed.name || 'Doctor';
      this.doctorEmail = parsed.email || '';
      this.doctorSpecialization = parsed.specialization || '';
      this.doctorId = parsed.id || 0;

      // Load dashboard data
      this.loadDashboardData();
    } else {
      this.toastr.error('Please login to continue');
      this.router.navigate(['/login']);
    }
  }

  loadDashboardData() {
    this.loading = true;

    this.api.getDoctorDashboard()
      .then((res: any) => {
        console.log('Doctor Dashboard Data:', res.data);
        
        if (res.data.status) {
          const data = res.data.data;
          this.totalPatients = data.total_patients || 0;
          this.upcomingAppointments = data.upcoming_appointments || 0;
          this.completedConsultations = data.completed_consultations || 0;
          this.pendingAppointments = data.pending_appointments || 0;
        }
      })
      .catch((error) => {
        console.error('Dashboard Error:', error);
        this.toastr.error('Failed to load dashboard data');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  logout(): void {
    localStorage.removeItem('doctor');
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    this.toastr.success('Logged out successfully');
    
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }
}