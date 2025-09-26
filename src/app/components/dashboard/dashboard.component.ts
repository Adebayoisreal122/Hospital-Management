import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  adminName: string = '';

  constructor(private router: Router) {}

    ngOnInit(): void {
    // Get admin info from localStorage (after login)
    const admin = localStorage.getItem('admin');
    if (admin) {
      const parsed = JSON.parse(admin);
      this.adminName = parsed.name || 'Admin';
    } else {
      // If no session, redirect to login
      this.router.navigate(['/admin-login']);
    }
  }

  logout(): void {
    // Clear storage/session
    localStorage.removeItem('admin');
    sessionStorage.clear();

    // Redirect to login
    this.router.navigate(['/admin-login']);
  }
}
