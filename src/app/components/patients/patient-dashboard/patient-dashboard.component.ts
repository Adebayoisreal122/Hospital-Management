import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit {
  patientName: string = '';
  patientEmail: string = '';
  patientId: number = 0;

  // Dashboard statistics
  nextAppointment: any = null;
  upcomingAppointmentsCount: number = 0;
  assignedDoctor: string = 'Not assigned yet';
  loading: boolean = true;

  constructor(
    public router: Router,
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get patient data from localStorage
    const patientData = localStorage.getItem('patient');

    if (patientData) {
      const parsed = JSON.parse(patientData);
      this.patientName = parsed.name || 'Patient';
      this.patientEmail = parsed.email || '';
      this.patientId = parsed.id || 0;

      // Load dashboard data
      this.loadDashboardData();
    } else {
      this.toastr.error('Please login to continue');
      this.router.navigate(['/login']);
    }
  }

  loadDashboardData() {
    this.loading = true;

    this.api.getPatientDashboard()
      .then((res: any) => {
        console.log('Dashboard Data:', res.data);
        
        if (res.data.status) {
          const data = res.data.data;
          this.nextAppointment = data.next_appointment;
          this.upcomingAppointmentsCount = data.upcoming_count || 0;
          this.assignedDoctor = data.assigned_doctor || 'Not assigned yet';
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
    localStorage.removeItem('patient');
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    this.toastr.success('Logged out successfully');
    
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }
}