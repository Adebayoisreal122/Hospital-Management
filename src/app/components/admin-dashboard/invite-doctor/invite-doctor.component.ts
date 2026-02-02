import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-invite-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invite-doctor.component.html',
  styleUrl: './invite-doctor.component.css'
})
export class InviteDoctorComponent {
  email: string = '';
  loading = false;

  constructor(private api: ApiService, private toastr: ToastrService) {}
  
  inviteDoctor() {
    if (!this.email || !this.isValidEmail(this.email)) {
      this.toastr.error('Please enter a valid email address');
      return;
    }

    this.loading = true;

    this.api
      .inviteDoctor({ email: this.email })
      .then((res: any) => {
        console.log('Full Axios Response:', res); // Debug log
        console.log('Response Data:', res.data); // Debug log
        
        // Axios wraps the response in res.data
        const responseData = res.data;
        
        if (responseData && responseData.status === true) {
          this.toastr.success(responseData.message || 'Invitation sent successfully!');
          this.email = '';
        } else {
          this.toastr.error(responseData?.message || 'Invitation failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error('API Error:', error); // Debug log
        console.error('Error Response:', error.response); // Debug log
        
        // Axios error handling
        if (error.response) {
          // Server responded with error status
          this.toastr.error(error.response.data?.message || 'Server error occurred');
        } else if (error.request) {
          // Request made but no response
          this.toastr.error('No response from server. Please check your connection.');
        } else {
          // Other errors
          this.toastr.error('An error occurred. Please try again.');
        }
      })
      .finally(() => (this.loading = false));
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}