import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-register.component.html',
  styleUrl: './admin-register.component.css'
})
export class AdminRegisterComponent {

  name = '';
  email = '';
  password = '';
  message = '';
  isLoading = false;

  constructor(private api: ApiService, private router: Router) {}

  register() {
    if (!this.name || !this.email || !this.password) {
      this.message = 'All fields are required';
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.api.registerAdmin({ 
      name: this.name, 
      email: this.email, 
      password: this.password 
    })
    .then(response => {
      // Axios wraps the response in 'data' property
      const apiResponse = response.data;
      
      console.log('Full response:', response);
      console.log('API response:', apiResponse);
      
      if (apiResponse.status) {
        this.message = apiResponse.message || 'Registration successful!';
        // Clear form on success
        this.name = '';
        this.email = '';
        this.password = '';

                setTimeout(() => {
          this.router.navigate(['/admin-login']);
        }, 1500); 
        
      } else {
        this.message = apiResponse.message || 'Registration failed';
      }
    })
    .catch(error => {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const apiResponse = error.response.data;
        this.message = apiResponse?.message || `Error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        this.message = 'No response from server. Please check your connection.';
      } else {
        // Something else happened
        this.message = 'Error: ' + error.message;
      }
    })
    .finally(() => {
      this.isLoading = false;
    });
  }
}