import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-accept-invitation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accept-invitation.component.html',
  styleUrls: ['./accept-invitation.component.css']
})
export class AcceptInvitationComponent implements OnInit {
  token: string = '';
  email: string = '';
  
  // Form fields
  name: string = '';
  specialization: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  
  loading = false;
  validating = true;
  tokenValid = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Get token from URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    
    if (!this.token) {
      this.validating = false;
      this.errorMessage = 'Invalid invitation link';
      return;
    }

    // Validate token
    this.validateToken();
  }

  validateToken() {
    this.api.validateInvitationToken(this.token)
      .then((res: any) => {
        console.log('Validation Response:', res.data);
        
        if (res.data.status) {
          this.tokenValid = true;
          this.email = res.data.data.email;
        } else {
          this.errorMessage = res.data.message || 'Invalid or expired invitation';
        }
      })
      .catch(() => {
        this.errorMessage = 'Error validating invitation';
      })
      .finally(() => {
        this.validating = false;
      });
  }

  completeRegistration() {
    // Validation
    if (!this.name || !this.specialization || !this.phone || !this.password) {
      this.toastr.error('All fields are required');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }

    if (this.password.length < 6) {
      this.toastr.error('Password must be at least 6 characters');
      return;
    }

    this.loading = true;

    this.api.completeInvitation({
      token: this.token,
      name: this.name,
      specialization: this.specialization,
      phone: this.phone,
      password: this.password
    })
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
      .catch(() => {
        this.toastr.error('Server error. Please try again.');
      })
      .finally(() => {
        this.loading = false;
      });
  }
}