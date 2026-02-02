import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {
  isEditing: boolean = false;
  loading: boolean = true;
  saving: boolean = false;

  profileData = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    specialization: '',
    created_at: ''
  };

  // Store original data for cancel functionality
  originalData: any = {};

  constructor(
    private api: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;

    this.api.getDoctorProfile()
      .then((res: any) => {
        console.log('Profile Response:', res.data);
        
        if (res.data.status) {
          this.profileData = res.data.data;
          this.originalData = { ...res.data.data };
        } else {
          this.toastr.error(res.data.message || 'Failed to load profile');
        }
      })
      .catch((error) => {
        console.error('Profile Error:', error);
        this.toastr.error('Failed to load profile');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  enableEdit() {
    this.isEditing = true;
    this.originalData = { ...this.profileData };
  }

  cancelEdit() {
    this.profileData = { ...this.originalData };
    this.isEditing = false;
  }

  saveProfile() {
    // Validation
    if (!this.profileData.name || !this.profileData.email || !this.profileData.phone || !this.profileData.specialization) {
      this.toastr.error('All fields are required');
      return;
    }

    this.saving = true;

    this.api.updateDoctorProfile(this.profileData)
      .then((res: any) => {
        console.log('Update Response:', res.data);
        
        if (res.data.status) {
          this.toastr.success('Profile updated successfully!');
          this.isEditing = false;
          this.originalData = { ...this.profileData };
          
          // Update localStorage
          const doctorData = localStorage.getItem('doctor');
          if (doctorData) {
            const parsed = JSON.parse(doctorData);
            parsed.name = this.profileData.name;
            parsed.email = this.profileData.email;
            parsed.specialization = this.profileData.specialization;
            localStorage.setItem('doctor', JSON.stringify(parsed));
          }
        } else {
          this.toastr.error(res.data.message || 'Failed to update profile');
        }
      })
      .catch((error) => {
        console.error('Update Error:', error);
        this.toastr.error(error.response?.data?.message || 'Failed to update profile');
      })
      .finally(() => {
        this.saving = false;
      });
  }

  deleteAccount() {
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    
    if (confirmation !== 'DELETE') {
      return;
    }

    if (!confirm('Are you absolutely sure? This action cannot be undone!')) {
      return;
    }

    this.api.deleteDoctorAccount()
      .then((res: any) => {
        if (res.data.status) {
          this.toastr.success('Account deleted successfully');
          localStorage.clear();
          sessionStorage.clear();
          
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        } else {
          this.toastr.error(res.data.message || 'Failed to delete account');
        }
      })
      .catch((error) => {
        console.error('Delete Error:', error);
        this.toastr.error('Failed to delete account');
      });
  }

  logout() {
    localStorage.removeItem('doctor');
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    this.toastr.success('Logged out successfully');
    
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }
}