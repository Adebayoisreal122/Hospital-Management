import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-schedule.component.html',
  styleUrls: ['./doctor-schedule.component.css']
})
export class DoctorScheduleComponent implements OnInit {
  schedules: any[] = [];
  loading: boolean = true;
  saving: boolean = false;

  // Form data
  showAddForm: boolean = false;
  newSchedule = {
    day_of_week: '',
    start_time: '',
    end_time: '',
    is_available: true
  };

  daysOfWeek = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' }
  ];

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules() {
    this.loading = true;

    this.api.getDoctorSchedule()
      .then((res: any) => {
        console.log('Schedule Response:', res.data);
        
        if (res.data.status) {
          this.schedules = res.data.data || [];
        } else {
          this.toastr.error(res.data.message || 'Failed to load schedule');
        }
      })
      .catch((error) => {
        console.error('Error loading schedule:', error);
        this.toastr.error('Failed to load schedule');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.newSchedule = {
      day_of_week: '',
      start_time: '',
      end_time: '',
      is_available: true
    };
  }

  addSchedule() {
    // Validation
    if (!this.newSchedule.day_of_week || !this.newSchedule.start_time || !this.newSchedule.end_time) {
      this.toastr.error('Please fill in all fields');
      return;
    }

    // Check if start time is before end time
    if (this.newSchedule.start_time >= this.newSchedule.end_time) {
      this.toastr.error('End time must be after start time');
      return;
    }

    // Check if day already exists
    const dayExists = this.schedules.some(s => s.day_of_week === this.newSchedule.day_of_week);
    if (dayExists) {
      this.toastr.error(`Schedule for ${this.newSchedule.day_of_week} already exists. Please update it instead.`);
      return;
    }

    this.saving = true;

    this.api.addDoctorSchedule(this.newSchedule)
      .then((res: any) => {
        console.log('Add Response:', res.data);
        
        if (res.data.status) {
          this.toastr.success('Schedule added successfully!');
          this.loadSchedules();
          this.toggleAddForm();
        } else {
          this.toastr.error(res.data.message || 'Failed to add schedule');
        }
      })
      .catch((error) => {
        console.error('Add Error:', error);
        this.toastr.error(error.response?.data?.message || 'Failed to add schedule');
      })
      .finally(() => {
        this.saving = false;
      });
  }

  updateSchedule(schedule: any) {
    this.saving = true;

    this.api.updateDoctorSchedule(schedule.id, {
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      is_available: schedule.is_available
    })
      .then((res: any) => {
        console.log('Update Response:', res.data);
        
        if (res.data.status) {
          this.toastr.success('Schedule updated successfully!');
          this.loadSchedules();
        } else {
          this.toastr.error(res.data.message || 'Failed to update schedule');
        }
      })
      .catch((error) => {
        console.error('Update Error:', error);
        this.toastr.error('Failed to update schedule');
      })
      .finally(() => {
        this.saving = false;
      });
  }

  deleteSchedule(scheduleId: number) {
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    this.api.deleteDoctorSchedule(scheduleId)
      .then((res: any) => {
        console.log('Delete Response:', res.data);
        
        if (res.data.status) {
          this.toastr.success('Schedule deleted successfully!');
          this.loadSchedules();
        } else {
          this.toastr.error(res.data.message || 'Failed to delete schedule');
        }
      })
      .catch((error) => {
        console.error('Delete Error:', error);
        this.toastr.error('Failed to delete schedule');
      });
  }

  toggleAvailability(schedule: any) {
    schedule.is_available = !schedule.is_available;
    this.updateSchedule(schedule);
  }

  getDayIcon(day: string): string {
    const icons: any = {
      'Monday': '📅',
      'Tuesday': '📅',
      'Wednesday': '📅',
      'Thursday': '📅',
      'Friday': '📅',
      'Saturday': '📅',
      'Sunday': '📅'
    };
    return icons[day] || '📅';
  }

  getDayColor(day: string): string {
    if (day === 'Sunday') return 'bg-red-50 border-red-200';
    if (day === 'Saturday') return 'bg-blue-50 border-blue-200';
    return 'bg-white border-gray-200';
  }

  getAvailableDays(): any[] {
    const scheduledDays = this.schedules.map(s => s.day_of_week);
    return this.daysOfWeek.filter(d => !scheduledDays.includes(d.value));
  }
}