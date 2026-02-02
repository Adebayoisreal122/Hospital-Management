import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-appointments.component.html',
  styleUrls: ['./patient-appointments.component.css']
})
export class PatientAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  loading: boolean = true;
  
  // Filter options
  selectedStatus: string = 'all';
  statusCounts = {
    all: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;

    this.api.getPatientAppointments()
      .then((res: any) => {
        console.log('Appointments Response:', res.data);
        
        if (res.data.status) {
          this.appointments = res.data.data || [];
          this.filteredAppointments = [...this.appointments];
          this.calculateStatusCounts();
        } else {
          this.toastr.error(res.data.message || 'Failed to load appointments');
        }
      })
      .catch((error) => {
        console.error('Error loading appointments:', error);
        this.toastr.error('Failed to load appointments');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  calculateStatusCounts() {
    this.statusCounts = {
      all: this.appointments.length,
      pending: this.appointments.filter(a => a.status === 'pending').length,
      confirmed: this.appointments.filter(a => a.status === 'confirmed').length,
      completed: this.appointments.filter(a => a.status === 'completed').length,
      cancelled: this.appointments.filter(a => a.status === 'cancelled').length
    };
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    
    if (status === 'all') {
      this.filteredAppointments = [...this.appointments];
    } else {
      this.filteredAppointments = this.appointments.filter(a => a.status === status);
    }
  }

  cancelAppointment(appointmentId: number) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    this.api.cancelAppointment(appointmentId)
      .then((res: any) => {
        console.log('Cancel Response:', res.data);
        
        if (res.data.status) {
          this.toastr.success('Appointment cancelled successfully');
          this.loadAppointments(); // Reload list
        } else {
          this.toastr.error(res.data.message || 'Failed to cancel appointment');
        }
      })
      .catch((error) => {
        console.error('Cancel Error:', error);
        this.toastr.error('Failed to cancel appointment');
      });
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

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✅';
      case 'completed':
        return '🎉';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  }

  canCancel(appointment: any): boolean {
    // Can cancel if status is pending or confirmed and date is in the future
    const appointmentDate = new Date(appointment.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return (appointment.status === 'pending' || appointment.status === 'confirmed') 
           && appointmentDate >= today;
  }

  bookNewAppointment() {
    this.router.navigate(['/patient-dashboard/book-appointment']);
  }
}