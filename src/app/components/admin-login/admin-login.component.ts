import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email = '';
  password = '';
  role = ''; // admin | doctor | patient
  message = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    if (!this.role) {
      this.message = 'Please select your role';
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
        this.message = 'Invalid role';
        return;
    }

    loginPromise
      .then(res => {
        if (res.data.status) {
          // Save login info in localStorage per role
          localStorage.setItem(this.role, JSON.stringify(res.data[this.role] || res.data));

          // Navigate based on role
          if (this.role === 'admin' || this.role === 'doctor') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/patient-dashboard']);
          }
        } else {
          this.message = res.data.message;
        }
      })
      .catch(err => {
        this.message = 'Error: ' + err.message;
      });
  }
}
