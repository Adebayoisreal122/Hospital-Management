import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patient-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-register.component.html',
  styleUrls: ['./patient-register.component.css']
})
export class PatientRegisterComponent {
  currentYear = new Date().getFullYear();
  
  formData = {
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    password: '',
    confirmPassword: ''
  };

  loading = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  register() {
    // Validation
    if (!this.formData.name || !this.formData.email || !this.formData.phone || 
        !this.formData.password || !this.formData.gender) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }

    if (this.formData.password.length < 6) {
      this.toastr.error('Password must be at least 6 characters');
      return;
    }

    this.loading = true;

    // Remove confirmPassword before sending
    const { confirmPassword, ...dataToSend } = this.formData;

    this.api.registerPatient(dataToSend)
      .then((res: any) => {
        console.log('Registration Response:', res.data);
        
        if (res.data.status) {
          this.toastr.success('Registration successful! Please login.');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.toastr.error(res.data.message || 'Registration failed');
        }
      })
      .catch((error) => {
        console.error('Registration Error:', error);
        this.toastr.error(error.response?.data?.message || 'Registration failed');
      })
      .finally(() => {
        this.loading = false;
      });
  }
}