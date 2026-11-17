import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  LucideIconData,
  Activity,
  ArrowRight,
  CalendarCheck,
  ChartColumn,
  CircleCheck,
  ClipboardList,
  Cloud,
  Headset,
  HeartPulse,
  LifeBuoy,
  Menu,
  Package,
  Play,
  Receipt,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCog,
  Users,
  X,
  Zap,
} from 'lucide-angular';

interface Feature {
  icon: LucideIconData;
  title: string;
  text: string;
  tile: string; // Tailwind classes for the icon tile
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  currentYear = new Date().getFullYear();
  isMobileMenuOpen = false;

  // Icons used in the template (imported individually so unused icons are tree-shaken out)
  readonly icons = {
    Activity, ArrowRight, CalendarCheck, CircleCheck, Cloud, Headset, HeartPulse,
    Menu, Play, ShieldCheck, Sparkles, Stethoscope, Users, X,
  };

  readonly features: Feature[] = [
    { icon: ClipboardList, title: 'Patient Management', text: 'Complete patient records, medical history, and treatment tracking in one secure platform.', tile: 'bg-blue-100 text-blue-600' },
    { icon: CalendarCheck, title: 'Appointment Scheduling', text: 'Smart scheduling system that optimizes doctor availability and reduces wait times.', tile: 'bg-green-100 text-green-600' },
    { icon: Package, title: 'Inventory Management', text: 'Track medical supplies, equipment, and pharmaceuticals with automated reorder alerts.', tile: 'bg-purple-100 text-purple-600' },
    { icon: Receipt, title: 'Billing & Insurance', text: 'Automated billing system with insurance claim processing and payment tracking.', tile: 'bg-red-100 text-red-600' },
    { icon: UserCog, title: 'Staff Management', text: 'Manage doctor schedules, staff assignments, and performance tracking efficiently.', tile: 'bg-yellow-100 text-yellow-600' },
    { icon: ChartColumn, title: 'Analytics & Reports', text: 'Comprehensive reporting tools with real-time analytics for better decision making.', tile: 'bg-indigo-100 text-indigo-600' },
    { icon: Zap, title: 'Lightning Fast', text: 'Cloud-based infrastructure ensures rapid response times and reliable performance.', tile: 'bg-orange-100 text-orange-600' },
    { icon: LifeBuoy, title: '24/7 Support', text: 'Round-the-clock technical support to ensure your hospital operations never stop.', tile: 'bg-teal-100 text-teal-600' },
  ];

  readonly whyChoose = [
    'Proven track record with 500+ hospitals',
    'Reduces administrative costs by 40%',
    'Improves patient satisfaction by 60%',
    '99.9% system uptime guarantee',
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Optional: Close menu when clicking outside
  onOutsideClick(): void {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }
}
