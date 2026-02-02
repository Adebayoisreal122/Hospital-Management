import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  doctors: any[] = [];
  selectedDoctorId: number = 0;
  appointmentDate: string = '';
  appointmentTime: string = '';
  reason: string = '';
  loading: boolean = false;
  loadingDoctors: boolean = true;

  // Get tomorrow's date as minimum
  minDate: string = '';

  constructor(
    private api: ApiService,
    public router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
  }

  ngOnInit(): void {

   const token = localStorage.getItem('authToken');
  console.log('Auth Token:', token); // Debug log
  
  if (!token) {
    this.toastr.error('Please login to continue');
    this.router.navigate(['/login']);
    return;
  }

    this.loadDoctors();

    // Check if doctor ID was passed from doctor list
    this.route.queryParams.subscribe(params => {
      if (params['doctorId']) {
        this.selectedDoctorId = +params['doctorId'];
      }
    });
  }

  loadDoctors() {
    this.loadingDoctors = true;

    this.api.getDoctors()
      .then((res: any) => {
        if (res.data.status) {
          this.doctors = res.data.data || [];
        }
      })
      .catch((error) => {
        console.error('Error loading doctors:', error);
        this.toastr.error('Failed to load doctors');
      })
      .finally(() => {
        this.loadingDoctors = false;
      });
  }

  bookAppointment() {
    // Validation
    if (!this.selectedDoctorId) {
      this.toastr.error('Please select a doctor');
      return;
    }

    if (!this.appointmentDate) {
      this.toastr.error('Please select a date');
      return;
    }

    if (!this.appointmentTime) {
      this.toastr.error('Please select a time');
      return;
    }

    this.loading = true;

    const appointmentData = {
      doctor_id: this.selectedDoctorId,
      appointment_date: this.appointmentDate,
      appointment_time: this.appointmentTime,
      reason: this.reason || 'General consultation'
    };

    this.api.bookAppointment(appointmentData)
      .then((res: any) => {
        console.log('Booking Response:', res.data);
        
        if (res.data.status) {
          this.toastr.success('Appointment booked successfully!');
          
          // Reset form
          this.selectedDoctorId = 0;
          this.appointmentDate = '';
          this.appointmentTime = '';
          this.reason = '';

          // Navigate to appointments page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/patient-dashboard/appointments']);
          }, 2000);
        } else {
          this.toastr.error(res.data.message || 'Failed to book appointment');
        }
      })
      .catch((error) => {
        console.error('Booking Error:', error);
        this.toastr.error(error.response?.data?.message || 'Failed to book appointment');
      })
      .finally(() => {
        this.loading = false;
      });
  }
}