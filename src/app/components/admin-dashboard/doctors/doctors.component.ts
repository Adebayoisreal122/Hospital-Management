import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  loading: boolean = true;

  // Filters
  searchTerm: string = '';
  selectedSpecialization: string = '';
  specializations: string[] = [];

  // Selected doctor for details
  selectedDoctor: any = null;
  showDoctorDetails: boolean = false;

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.loading = true;

    this.api.getDoctors()
      .then((res: any) => {
        console.log('Doctors Response:', res.data);
        
        if (res.data.status) {
          this.doctors = res.data.data || [];
          this.filteredDoctors = [...this.doctors];
          
          // Extract unique specializations
          this.specializations = [...new Set(this.doctors.map(d => d.specialization))];
        } else {
          this.toastr.error(res.data.message || 'Failed to load doctors');
        }
      })
      .catch((error) => {
        console.error('Error loading doctors:', error);
        this.toastr.error('Failed to load doctors');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  applyFilters() {
    let filtered = [...this.doctors];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(term) ||
        d.email.toLowerCase().includes(term) ||
        d.specialization.toLowerCase().includes(term) ||
        (d.phone && d.phone.includes(term))
      );
    }

    // Specialization filter
    if (this.selectedSpecialization) {
      filtered = filtered.filter(d => d.specialization === this.selectedSpecialization);
    }

    this.filteredDoctors = filtered;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedSpecialization = '';
    this.filteredDoctors = [...this.doctors];
  }

  viewDoctorDetails(doctor: any) {
    this.selectedDoctor = doctor;
    this.showDoctorDetails = true;
    
    // Load doctor statistics
    this.loadDoctorStats(doctor.id);
  }

  closeDoctorDetails() {
    this.selectedDoctor = null;
    this.showDoctorDetails = false;
  }

  loadDoctorStats(doctorId: number) {
    this.api.getDoctorStats(doctorId)
      .then((res: any) => {
        if (res.data.status && this.selectedDoctor) {
          this.selectedDoctor.stats = res.data.data;
        }
      })
      .catch((error) => {
        console.error('Error loading doctor stats:', error);
      });
  }

  deleteDoctor(doctorId: number, doctorName: string) {
    const confirmation = prompt(`Type "${doctorName}" to confirm deletion:`);
    
    if (confirmation !== doctorName) {
      this.toastr.warning('Doctor name does not match');
      return;
    }

    if (!confirm('Are you sure you want to delete this doctor? This will cancel all their future appointments.')) {
      return;
    }

    this.api.deleteDoctor(doctorId)
      .then((res: any) => {
        if (res.data.status) {
          this.toastr.success('Doctor deleted successfully');
          this.loadDoctors();
          this.closeDoctorDetails();
        } else {
          this.toastr.error(res.data.message || 'Failed to delete doctor');
        }
      })
      .catch((error) => {
        console.error('Delete Error:', error);
        this.toastr.error('Failed to delete doctor');
      });
  }
}