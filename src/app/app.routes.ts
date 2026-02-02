import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { AdminLoginComponent } from './components/login/admin-login.component';

// Admin-related pages
import { DashboardComponent } from './components/admin-dashboard/dashboard/dashboard.component';
import { DoctorsComponent } from './components/admin-dashboard/doctors/doctors.component';
import { PatientsComponent } from './components/admin-dashboard/patients/patients.component';
import { AppointmentsComponent } from './components/admin-dashboard/appointments/appointments.component';
import { InvoicesComponent } from './components/admin-dashboard/invoices/invoices.component';

// New doctor & patient dashboards
import { DoctorDashboardComponent } from './doctors/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './components/patients/patient-dashboard/patient-dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { InviteDoctorComponent } from './components/admin-dashboard/invite-doctor/invite-doctor.component';
import { AcceptInvitationComponent } from './components/accept-invitation/accept-invitation.component';
import { PatientRegisterComponent } from './components/patient-register/patient-register.component';
import { PatientAppointmentsComponent } from './components/patients/patient-appointments/patient-appointments.component';
import { BookAppointmentComponent } from './components/patients/book-appointment/book-appointment.component';
import { PatientProfileComponent } from './components/patients/patient-profile/patient-profile.component';
import { DoctorListComponent } from './components/patients/doctor-list/doctor-list.component';
import { DoctorAppointmentsComponent } from './doctors/doctor-appointments/doctor-appointments.component';
import { DoctorPatientsComponent } from './doctors/doctor-patients/doctor-patients.component';
import { DoctorScheduleComponent } from './doctors/doctor-schedule/doctor-schedule.component';
import { DoctorProfileComponent } from './doctors/doctor-profile/doctor-profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin-register', component: AdminRegisterComponent },
  { path: 'login', component: AdminLoginComponent },
  { path: 'patient-register', component: PatientRegisterComponent },
  

  // ✅ ADMIN DASHBOARD (with child pages)
  {
    path: 'admin-dashboard',
    component: DashboardComponent,
    children: [
      { path: 'doctors', component: DoctorsComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'invite-doctor', component: InviteDoctorComponent },
      { path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' },
    ],
  },

  // ✅ DOCTOR DASHBOARD (standalone)
  { path: 'doctor-dashboard', component: DoctorDashboardComponent },
   { path: 'accept-invitation', component: AcceptInvitationComponent },

  // ✅ DOCTOR DASHBOARD (with child pages)
  {
    path: 'doctor-dashboard',
    component: DoctorDashboardComponent,
    children: [
      { path: 'appointments', component: DoctorAppointmentsComponent },
      { path: 'patients', component: DoctorPatientsComponent },
      { path: 'schedule', component: DoctorScheduleComponent },
      { path: 'profile', component: DoctorProfileComponent },
    ]
  },


  // ✅ PATIENT DASHBOARD (standalone)
    {
    path: 'patient-dashboard',
    component: PatientDashboardComponent,
    children: [
      { path: 'book-appointment', component: BookAppointmentComponent }, // We'll create this
      { path: 'appointments', component: PatientAppointmentsComponent }, // We'll create this
      { path: 'doctors', component: DoctorListComponent }, // We'll create this
      { path: 'profile', component: PatientProfileComponent }, // We'll create this
    ]
  },

  // Redirect any unknown route to home
  { path: '**', component: NotFoundComponent },
];
