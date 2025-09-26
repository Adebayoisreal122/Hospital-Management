import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { PatientsComponent } from './components/patients/patients.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { InvoicesComponent } from './components/invoices/invoices.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin-register', component: AdminRegisterComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'doctors', component: DoctorsComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: '', redirectTo: 'doctors', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
