import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  loading: boolean = true;

  // Filters
  searchTerm: string = '';
  selectedGender: string = '';
  
  // Selected patient for details
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

    this.api.getAllPatients()
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
        (p.phone && p.phone.includes(term)) ||
        (p.address && p.address.toLowerCase().includes(term))
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
    this.loadPatientHistory(patient.id);
  }

  closePatientDetails() {
    this.selectedPatient = null;
    this.showPatientDetails = false;
  }

  loadPatientHistory(patientId: number) {
    this.api.getPatientHistory(patientId)
      .then((res: any) => {
        if (res.data.status && this.selectedPatient) {
          this.selectedPatient.appointments = res.data.data;
        }
      })
      .catch((error) => {
        console.error('Error loading patient history:', error);
      });
  }

  deletePatient(patientId: number, patientName: string) {
    const confirmation = prompt(`Type "${patientName}" to confirm deletion:`);
    
    if (confirmation !== patientName) {
      this.toastr.warning('Patient name does not match');
      return;
    }

    if (!confirm('Are you sure you want to delete this patient? This will cancel all their future appointments.')) {
      return;
    }

    this.api.deletePatient(patientId)
      .then((res: any) => {
        if (res.data.status) {
          this.toastr.success('Patient deleted successfully');
          this.loadPatients();
          this.closePatientDetails();
        } else {
          this.toastr.error(res.data.message || 'Failed to delete patient');
        }
      })
      .catch((error) => {
        console.error('Delete Error:', error);
        this.toastr.error('Failed to delete patient');
      });
  }

  calculateAge(dateOfBirth: string): number | string {
    if (!dateOfBirth || dateOfBirth === '0000-00-00') return 'N/A';
    
    // Parse the date string properly
    let dob: Date;
    
    if (dateOfBirth.includes('-')) {
      const [year, month, day] = dateOfBirth.split('-').map(Number);
      dob = new Date(year, month - 1, day);
    } else {
      dob = new Date(dateOfBirth);
    }
    
    if (isNaN(dob.getTime())) {
      return 'N/A';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    
    if (age < 0 || age > 150) {
      return 'N/A';
    }
    
    return age;
  }



  get malePatientsCount(): number {
  return this.patients.filter(p => p.gender === 'male').length;
}

get femalePatientsCount(): number {
  return this.patients.filter(p => p.gender === 'female').length;
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