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
  return axios.post(`${this.baseUrl}/admin_login.php`, { 
    email: data.email,
    password: data.password,
    role: 'admin'  // ✅ Explicitly include role
  }, { 
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// Get admin dashboard statistics
getAdminDashboardStats() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_admin_dashboard_stats.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Get doctor statistics
getDoctorStats(doctorId: number) {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_doctor_stats.php?doctor_id=${doctorId}`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Delete doctor
deleteDoctor(doctorId: number) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/delete_doctor.php`, 
    { doctor_id: doctorId },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
}


// Get all patients (Admin)
getAllPatients() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_all_patients.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Get patient history (Admin)
getPatientHistory(patientId: number) {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_patient_history.php?patient_id=${patientId}`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}
// Get all appointments (Admin)
getAllAppointments() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_all_appointments.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Admin update appointment status
adminUpdateAppointmentStatus(appointmentId: number, status: string, notes?: string) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/admin_update_appointment_status.php`, 
    { 
      appointment_id: appointmentId, 
      status: status,
      notes: notes 
    },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
}

// Delete appointment (Admin)
deleteAppointment(appointmentId: number) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/delete_appointment.php`, 
    { appointment_id: appointmentId },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
}

// Delete patient (Admin)
deletePatient(patientId: number) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/delete_patient.php`, 
    { patient_id: patientId },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
}


/**
 * Get all invoices with patient and doctor information
 * Admin only
 */
getAllInvoices() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_all_invoices.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

/**
 * Get completed appointments that don't have invoices
 * Used when creating new invoices
 * Admin only
 */
getCompletedAppointmentsWithoutInvoice() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_completed_appointments_without_invoice.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

/**
 * Create a new invoice for a completed appointment
 * Admin only
 */
createInvoice(data: { appointment_id: number; amount: number; notes?: string }) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/create_invoice.php`, data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

/**
 * Mark an invoice as paid
 * Admin only
 */
markInvoiceAsPaid(invoiceId: number, paymentMethod: string) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/mark_invoice_paid.php`, 
    { 
      invoice_id: invoiceId, 
      payment_method: paymentMethod 
    },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
}

/**
 * Cancel an invoice
 * Admin only
 */
cancelInvoice(invoiceId: number) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/cancel_invoice.php`, 
    { invoice_id: invoiceId },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
}

/**
 * Delete an invoice permanently
 * Admin only
 */
deleteInvoice(invoiceId: number) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/delete_invoice.php`, 
    { invoice_id: invoiceId },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
}

loginDoctor(data: any) {
  return axios.post(`${this.baseUrl}/admin_login.php`, { 
    email: data.email,
    password: data.password,
    role: 'doctor'  // ✅ Explicitly include role
  }, { 
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

validateInvitationToken(token: string) {
  return axios.get(
    `${this.baseUrl}/admin.php?action=accept-invite&token=${token}`,
    { withCredentials: true }
  );
}

completeInvitation(data: any) {
  return axios.post(
    `${this.baseUrl}/admin.php?action=complete-invite`,
    data,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

registerPatient(data: any) {
  return axios.post(`${this.baseUrl}/patient_register.php`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

loginPatient(data: any) {
  return axios.post(`${this.baseUrl}/admin_login.php`, { 
    email: data.email,
    password: data.password,
    role: 'patient'  // ✅ Explicitly include role
  }, { 
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

getPatientDashboard() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/patient_dashboard.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}


bookAppointment(data: any) {
  const token = localStorage.getItem('authToken');
  
  console.log('Booking with token:', token); // Debug log
  
  if (!token) {
    return Promise.reject(new Error('No authentication token found'));
  }
  
  return axios.post(`${this.baseUrl}/book_appointment.php`, data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}


// Get patient appointments
getPatientAppointments() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_patient_appointments.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Cancel appointment
cancelAppointment(appointmentId: number) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/cancel_appointment.php`, 
    { appointment_id: appointmentId },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
}


// Get patient profile
getPatientProfile() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_patient_profile.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Update patient profile
updatePatientProfile(data: any) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/update_patient_profile.php`, data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Delete patient account
deletePatientAccount() {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/delete_patient_account.php`, {}, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}


  logoutAdmin() {
    return axios.get(`${this.baseUrl}/admin.php?action=logout`, { withCredentials: true });
  }

  // Doctor
  getDoctors() {
    return axios.get(`${this.baseUrl}/get_doctors.php`, { withCredentials: true });
  }


// Get doctor dashboard data
getDoctorDashboard() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_doctor_dashboard.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Get doctor appointments
getDoctorAppointments() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_doctor_appointments.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Update appointment status
updateAppointmentStatus(appointmentId: number, status: string, notes?: string) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/update_appointment_status.php`, 
    { 
      appointment_id: appointmentId, 
      status: status,
      notes: notes 
    },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
}

// Get doctor patients
getDoctorPatients() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_doctor_patients.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Get patient appointment history
getPatientAppointmentHistory(patientId: number) {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_patient_appointment_history.php?patient_id=${patientId}`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Get doctor schedule
getDoctorSchedule() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_doctor_schedule.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Add doctor schedule
addDoctorSchedule(data: any) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/add_doctor_schedule.php`, data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Update doctor schedule
updateDoctorSchedule(scheduleId: number, data: any) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/update_doctor_schedule.php`, 
    { schedule_id: scheduleId, ...data },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
}

// Delete doctor schedule
deleteDoctorSchedule(scheduleId: number) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/delete_doctor_schedule.php`, 
    { schedule_id: scheduleId },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
}

// Get doctor profile
getDoctorProfile() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/get_doctor_profile.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Update doctor profile
updateDoctorProfile(data: any) {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/update_doctor_profile.php`, data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

// Delete doctor account
deleteDoctorAccount() {
  const token = localStorage.getItem('authToken');
  
  return axios.post(`${this.baseUrl}/delete_doctor_account.php`, {}, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
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
  
  
inviteDoctor(data: { email: string }) {
  const token = localStorage.getItem('authToken'); // Get the stored auth token
  
  return axios.post(
    `${this.baseUrl}/admin.php?action=invite-doctor`,
    data,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add auth token
      }
    }
  );
}
 
  

}