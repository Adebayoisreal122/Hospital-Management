import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  currentYear = new Date().getFullYear();

  email = '';
  password = '';
  role = ''; // admin | doctor | patient

  constructor(
    private api: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login() {
    if (!this.role) {
      this.toastr.warning('Please select your role', 'Warning');
      return;
    }

    let loginPromise: Promise<any>;

    switch (this.role) {
      case 'admin':
        loginPromise = this.api.loginAdmin({ email: this.email, password: this.password });
        break;
      case 'doctor':
        loginPromise = this.api.loginDoctor({ email: this.email, password: this.password });
        break;
      case 'patient':
        loginPromise = this.api.loginPatient({ email: this.email, password: this.password });
        break;
      default:
        this.toastr.error('Invalid role', 'Error');
        return;
    }

    loginPromise
      .then((res) => {
        console.log('Login Response:', res.data); // Debug log to check response structure
        
        if (res.data.status) {
          // ✅ IMPORTANT: Store the authentication token
          if (res.data.token) {
            localStorage.setItem('authToken', res.data.token);
          }

          // Save login info in localStorage per role
          localStorage.setItem(this.role, JSON.stringify(res.data.data || res.data[this.role] || res.data));

          // Show success toast
          this.toastr.success(`Welcome back, ${this.role}!`, 'Login Successful');

          // Wait 3s before redirecting to allow toast display
          setTimeout(() => {
            switch (this.role) {
              case 'admin':
                this.router.navigate(['/admin-dashboard']);
                break;
              case 'doctor':
                this.router.navigate(['/doctor-dashboard']);
                break;
              case 'patient':
                this.router.navigate(['/patient-dashboard']);
                break;
            }
          }, 3000);
        } else {
          this.toastr.error(res.data.message || 'Login failed', 'Error');
        }
      })
      .catch((err) => {
        console.error('Login Error:', err); // Debug log
        this.toastr.error('Error: ' + (err.response?.data?.message || err.message), 'Error');
      });
  }
}