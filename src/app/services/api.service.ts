import { Injectable } from '@angular/core';
import axios from 'axios';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost/Hospital-management';
  constructor() { }

   registerAdmin(data: any) {
    console.log('Registering admin with data:', data);
    console.log('Sending request to:', `${this.baseUrl}/admin_register.php`);
    
    return axios.post(`${this.baseUrl}/admin_register.php`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  
loginAdmin(data: any) {
  return axios.post(`${this.baseUrl}/admin_login.php`, data, { 
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

loginDoctor(data: any) {
  return axios.post(`${this.baseUrl}/admin_login.php`, data, { 
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

loginPatient(data: any) {
  return axios.post(`${this.baseUrl}/admin_login.php`, data, { 
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

  logoutAdmin() {
    return axios.get(`${this.baseUrl}/admin.php?action=logout`, { withCredentials: true });
  }

  // Doctor
  getDoctors() {
    return axios.get(`${this.baseUrl}/doctor.php`, { withCredentials: true });
  }

  // Patient
  getPatients() {
    return axios.get(`${this.baseUrl}/patient.php`, { withCredentials: true });
  }

  // Appointment
  getAppointments() {
    return axios.get(`${this.baseUrl}/appointment.php`, { withCredentials: true });
  }

  // Invoice
  getInvoices() {
    return axios.get(`${this.baseUrl}/invoice.php`, { withCredentials: true });
  }
}
