import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;
  constructor() { }

   registerAdmin(data: any) {
    
    return axios.post(`${this.baseUrl}/auth/admin_register.php`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  
loginAdmin(data: any) {
  return axios.post(`${this.baseUrl}/auth/login.php`, { 
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
  
  return axios.get(`${this.baseUrl}/admin/get_admin_dashboard_stats.php`, {
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
  
  return axios.get(`${this.baseUrl}/admin/get_doctor_stats.php?doctor_id=${doctorId}`, {
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
  
  return axios.post(`${this.baseUrl}/admin/delete_doctor.php`, 
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
  
  return axios.get(`${this.baseUrl}/admin/get_all_patients.php`, {
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
  
  return axios.get(`${this.baseUrl}/admin/get_patient_history.php?patient_id=${patientId}`, {
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
  
  return axios.get(`${this.baseUrl}/admin/get_all_appointments.php`, {
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
  
  return axios.post(`${this.baseUrl}/admin/admin_update_appointment_status.php`, 
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
  
  return axios.post(`${this.baseUrl}/admin/delete_appointment.php`, 
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
  
  return axios.post(`${this.baseUrl}/admin/delete_patient.php`, 
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
  
  return axios.get(`${this.baseUrl}/admin/get_all_invoices.php`, {
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
  
  return axios.get(`${this.baseUrl}/admin/get_completed_appointments_without_invoice.php`, {
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
  
  return axios.post(`${this.baseUrl}/admin/create_invoice.php`, data, {
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
  
  return axios.post(`${this.baseUrl}/admin/mark_invoice_paid.php`, 
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
  
  return axios.post(`${this.baseUrl}/admin/cancel_invoice.php`, 
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
  
  return axios.post(`${this.baseUrl}/admin/delete_invoice.php`, 
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
  return axios.post(`${this.baseUrl}/auth/login.php`, { 
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
    `${this.baseUrl}/auth/invitations.php?action=accept-invite&token=${token}`,
    { withCredentials: true }
  );
}

completeInvitation(data: any) {
  return axios.post(
    `${this.baseUrl}/auth/invitations.php?action=complete-invite`,
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
  return axios.post(`${this.baseUrl}/auth/patient_register.php`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

loginPatient(data: any) {
  return axios.post(`${this.baseUrl}/auth/login.php`, { 
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
  
  return axios.get(`${this.baseUrl}/patient/patient_dashboard.php`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}


bookAppointment(data: any) {
  const token = localStorage.getItem('authToken');
  
  
  if (!token) {
    return Promise.reject(new Error('No authentication token found'));
  }
  
  return axios.post(`${this.baseUrl}/patient/book_appointment.php`, data, {
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
  
  return axios.get(`${this.baseUrl}/patient/get_patient_appointments.php`, {
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
  
  return axios.post(`${this.baseUrl}/patient/cancel_appointment.php`, 
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
  
  return axios.get(`${this.baseUrl}/patient/get_patient_profile.php`, {
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
  
  return axios.post(`${this.baseUrl}/patient/update_patient_profile.php`, data, {
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
  
  return axios.post(`${this.baseUrl}/patient/delete_patient_account.php`, {}, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}



  // Doctor
  getDoctors() {
    return axios.get(`${this.baseUrl}/shared/get_doctors.php`, { withCredentials: true });
  }


// Get doctor dashboard data
getDoctorDashboard() {
  const token = localStorage.getItem('authToken');
  
  return axios.get(`${this.baseUrl}/doctor/get_doctor_dashboard.php`, {
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
  
  return axios.get(`${this.baseUrl}/doctor/get_doctor_appointments.php`, {
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
  
  return axios.post(`${this.baseUrl}/doctor/update_appointment_status.php`, 
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
  
  return axios.get(`${this.baseUrl}/doctor/get_doctor_patients.php`, {
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
  
  return axios.get(`${this.baseUrl}/doctor/get_patient_appointment_history.php?patient_id=${patientId}`, {
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
  
  return axios.get(`${this.baseUrl}/doctor/get_doctor_schedule.php`, {
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
  
  return axios.post(`${this.baseUrl}/doctor/add_doctor_schedule.php`, data, {
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
  
  return axios.post(`${this.baseUrl}/doctor/update_doctor_schedule.php`, 
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
  
  return axios.post(`${this.baseUrl}/doctor/delete_doctor_schedule.php`, 
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
  
  return axios.get(`${this.baseUrl}/doctor/get_doctor_profile.php`, {
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
  
  return axios.post(`${this.baseUrl}/doctor/update_doctor_profile.php`, data, {
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
  
  return axios.post(`${this.baseUrl}/doctor/delete_doctor_account.php`, {}, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}



  
  
inviteDoctor(data: { email: string }) {
  const token = localStorage.getItem('authToken'); // Get the stored auth token
  
  return axios.post(
    `${this.baseUrl}/auth/invitations.php?action=invite-doctor`,
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