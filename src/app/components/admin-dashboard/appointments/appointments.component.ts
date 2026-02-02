import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  loading: boolean = true;

  // Filters
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedDate: string = '';
  selectedDoctor: string = '';
  
  doctors: any[] = [];
  
  statusCounts = {
    all: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  };

  // For updating appointment
  updatingAppointmentId: number | null = null;

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadDoctors();
  }

  loadAppointments() {
    this.loading = true;

    this.api.getAllAppointments()
      .then((res: any) => {
        console.log('Appointments Response:', res.data);
        
        if (res.data.status) {
          this.appointments = res.data.data || [];
          this.filteredAppointments = [...this.appointments];
          this.calculateStatusCounts();
          this.applyFilters();
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

  loadDoctors() {
    this.api.getDoctors()
      .then((res: any) => {
        if (res.data.status) {
          this.doctors = res.data.data || [];
        }
      })
      .catch((error) => {
        console.error('Error loading doctors:', error);
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

  applyFilters() {
    let filtered = [...this.appointments];

    // Status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(a => a.status === this.selectedStatus);
    }

    // Date filter
    if (this.selectedDate) {
      filtered = filtered.filter(a => a.appointment_date === this.selectedDate);
    }

    // Doctor filter
    if (this.selectedDoctor) {
      filtered = filtered.filter(a => a.doctor_id === parseInt(this.selectedDoctor));
    }

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.patient_name.toLowerCase().includes(term) ||
        a.doctor_name.toLowerCase().includes(term) ||
        a.reason.toLowerCase().includes(term)
      );
    }

    this.filteredAppointments = filtered;
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedDate = '';
    this.selectedDoctor = '';
    this.applyFilters();
  }

  updateAppointmentStatus(appointmentId: number, newStatus: string, notes?: string) {
    this.updatingAppointmentId = appointmentId;

    this.api.adminUpdateAppointmentStatus(appointmentId, newStatus, notes)
      .then((res: any) => {
        console.log('Update Response:', res.data);
        
        if (res.data.status) {
          this.toastr.success(`Appointment ${newStatus} successfully`);
          this.loadAppointments();
        } else {
          this.toastr.error(res.data.message || 'Failed to update appointment');
        }
      })
      .catch((error) => {
        console.error('Update Error:', error);
        this.toastr.error('Failed to update appointment');
      })
      .finally(() => {
        this.updatingAppointmentId = null;
      });
  }

  confirmAppointment(appointmentId: number) {
    if (confirm('Confirm this appointment?')) {
      this.updateAppointmentStatus(appointmentId, 'confirmed');
    }
  }

  completeAppointment(appointmentId: number) {
    const notes = prompt('Enter consultation notes (optional):');
    if (notes !== null) {
      this.updateAppointmentStatus(appointmentId, 'completed', notes);
    }
  }

  cancelAppointment(appointmentId: number) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.updateAppointmentStatus(appointmentId, 'cancelled');
    }
  }

  deleteAppointment(appointmentId: number) {
    if (!confirm('Are you sure you want to permanently delete this appointment? This action cannot be undone.')) {
      return;
    }

    this.api.deleteAppointment(appointmentId)
      .then((res: any) => {
        if (res.data.status) {
          this.toastr.success('Appointment deleted successfully');
          this.loadAppointments();
        } else {
          this.toastr.error(res.data.message || 'Failed to delete appointment');
        }
      })
      .catch((error) => {
        console.error('Delete Error:', error);
        this.toastr.error('Failed to delete appointment');
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
}