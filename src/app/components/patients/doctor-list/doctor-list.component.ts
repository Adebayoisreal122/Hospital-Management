import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  specializations: string[] = [];
  
  searchTerm: string = '';
  selectedSpecialization: string = '';
  loading: boolean = true;

  constructor(
    private api: ApiService,
    private router: Router,
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

  filterDoctors() {
    this.filteredDoctors = this.doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           doctor.specialization.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesSpecialization = !this.selectedSpecialization || 
                                   doctor.specialization === this.selectedSpecialization;
      
      return matchesSearch && matchesSpecialization;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedSpecialization = '';
    this.filteredDoctors = [...this.doctors];
  }

  bookAppointment(doctorId: number) {
    // Navigate to book appointment with doctor pre-selected
    this.router.navigate(['/patient-dashboard/book-appointment'], {
      queryParams: { doctorId: doctorId }
    });
  }
}