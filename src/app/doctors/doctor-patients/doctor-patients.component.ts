import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-patients.component.html',
  styleUrls: ['./doctor-patients.component.css']
})
export class DoctorPatientsComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  loading: boolean = true;
  
  searchTerm: string = '';
  selectedGender: string = '';
  
  // Selected patient for details view
  selectedPatient: any = null;
  showPatientDetails: boolean = false;

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;

    this.api.getDoctorPatients()
      .then((res: any) => {
        console.log('Patients Response:', res.data);
        
        if (res.data.status) {
          this.patients = res.data.data || [];
          this.filteredPatients = [...this.patients];
        } else {
          this.toastr.error(res.data.message || 'Failed to load patients');
        }
      })
      .catch((error) => {
        console.error('Error loading patients:', error);
        this.toastr.error('Failed to load patients');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  applyFilters() {
    let filtered = [...this.patients];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term) ||
        (p.phone && p.phone.includes(term))
      );
    }

    // Gender filter
    if (this.selectedGender) {
      filtered = filtered.filter(p => p.gender === this.selectedGender);
    }

    this.filteredPatients = filtered;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedGender = '';
    this.filteredPatients = [...this.patients];
  }

  viewPatientDetails(patient: any) {
    this.selectedPatient = patient;
    this.showPatientDetails = true;
    
    // Load patient appointment history
    this.loadPatientAppointments(patient.patient_id);
  }

  closePatientDetails() {
    this.selectedPatient = null;
    this.showPatientDetails = false;
  }

  loadPatientAppointments(patientId: number) {
    this.api.getPatientAppointmentHistory(patientId)
      .then((res: any) => {
        if (res.data.status && this.selectedPatient) {
          this.selectedPatient.appointments = res.data.data || [];
        }
      })
      .catch((error) => {
        console.error('Error loading patient appointments:', error);
      });
  }

calculateAge(dateOfBirth: string): number | string {
  if (!dateOfBirth) return 'N/A';
  
  // Handle MySQL date format (YYYY-MM-DD)
  const dob = new Date(dateOfBirth + 'T00:00:00'); // Add time to ensure correct parsing
  
  // Check if date is valid
  if (isNaN(dob.getTime())) {
    return 'N/A';
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
  
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  // Return N/A if age is negative or unrealistic
  if (age < 0 || age > 150) {
    return 'N/A';
  }
  
  return age;
}

  getGenderIcon(gender: string): string {
    switch (gender?.toLowerCase()) {
      case 'male':
        return '👨';
      case 'female':
        return '👩';
      default:
        return '👤';
    }
  }

  
get malePatientsCount(): number {
  return this.patients.filter(p => p.gender === 'male').length;
}

get femalePatientsCount(): number {
  return this.patients.filter(p => p.gender === 'female').length;
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