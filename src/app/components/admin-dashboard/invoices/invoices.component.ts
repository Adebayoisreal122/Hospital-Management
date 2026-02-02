import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  invoices: any[] = [];
  filteredInvoices: any[] = [];
  appointments: any[] = [];
  loading: boolean = true;

  // Filters
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedMonth: string = '';

  statusCounts = {
    all: 0,
    pending: 0,
    paid: 0,
    cancelled: 0
  };

  totalRevenue: number = 0;
  pendingAmount: number = 0;
  paidAmount: number = 0;

  // Create invoice modal
  showCreateModal: boolean = false;
  newInvoice = {
    appointment_id: 0,
    amount: 0,
    notes: ''
  };
  savingInvoice: boolean = false;

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.loadAppointments();
  }

  loadInvoices() {
    this.loading = true;

    this.api.getAllInvoices()
      .then((res: any) => {
        console.log('Invoices Response:', res.data);
        
        if (res.data.status) {
          this.invoices = res.data.data || [];
          this.filteredInvoices = [...this.invoices];
          this.calculateStats();
          this.applyFilters();
        } else {
          this.toastr.error(res.data.message || 'Failed to load invoices');
        }
      })
      .catch((error) => {
        console.error('Error loading invoices:', error);
        this.toastr.error('Failed to load invoices');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadAppointments() {
    this.api.getCompletedAppointmentsWithoutInvoice()
      .then((res: any) => {
        if (res.data.status) {
          this.appointments = res.data.data || [];
        }
      })
      .catch((error) => {
        console.error('Error loading appointments:', error);
      });
  }

  calculateStats() {
    this.statusCounts = {
      all: this.invoices.length,
      pending: this.invoices.filter(i => i.status === 'pending').length,
      paid: this.invoices.filter(i => i.status === 'paid').length,
      cancelled: this.invoices.filter(i => i.status === 'cancelled').length
    };

    this.totalRevenue = this.invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + parseFloat(i.amount), 0);

    this.pendingAmount = this.invoices
      .filter(i => i.status === 'pending')
      .reduce((sum, i) => sum + parseFloat(i.amount), 0);

    this.paidAmount = this.totalRevenue;
  }

  applyFilters() {
    let filtered = [...this.invoices];

    // Status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(i => i.status === this.selectedStatus);
    }

    // Month filter
    if (this.selectedMonth) {
      filtered = filtered.filter(i => {
        const invoiceMonth = i.created_at.substring(0, 7); // YYYY-MM
        return invoiceMonth === this.selectedMonth;
      });
    }

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(i => 
        i.patient_name.toLowerCase().includes(term) ||
        i.doctor_name.toLowerCase().includes(term) ||
        i.id.toString().includes(term)
      );
    }

    this.filteredInvoices = filtered;
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedMonth = '';
    this.applyFilters();
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.newInvoice = {
      appointment_id: 0,
      amount: 0,
      notes: ''
    };
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createInvoice() {
    if (!this.newInvoice.appointment_id || this.newInvoice.amount <= 0) {
      this.toastr.error('Please select an appointment and enter a valid amount');
      return;
    }

    this.savingInvoice = true;

    this.api.createInvoice(this.newInvoice)
      .then((res: any) => {
        console.log('Create Response:', res.data);
        
        if (res.data.status) {
          this.toastr.success('Invoice created successfully!');
          this.loadInvoices();
          this.loadAppointments();
          this.closeCreateModal();
        } else {
          this.toastr.error(res.data.message || 'Failed to create invoice');
        }
      })
      .catch((error) => {
        console.error('Create Error:', error);
        this.toastr.error(error.response?.data?.message || 'Failed to create invoice');
      })
      .finally(() => {
        this.savingInvoice = false;
      });
  }

  markAsPaid(invoiceId: number) {
    const paymentMethod = prompt('Enter payment method (e.g., Cash, Card, Transfer):');
    if (!paymentMethod) return;

    this.api.markInvoiceAsPaid(invoiceId, paymentMethod)
      .then((res: any) => {
        if (res.data.status) {
          this.toastr.success('Invoice marked as paid!');
          this.loadInvoices();
        } else {
          this.toastr.error(res.data.message || 'Failed to update invoice');
        }
      })
      .catch((error) => {
        console.error('Update Error:', error);
        this.toastr.error('Failed to update invoice');
      });
  }

  cancelInvoice(invoiceId: number) {
    if (!confirm('Are you sure you want to cancel this invoice?')) {
      return;
    }

    this.api.cancelInvoice(invoiceId)
      .then((res: any) => {
        if (res.data.status) {
          this.toastr.success('Invoice cancelled successfully');
          this.loadInvoices();
        } else {
          this.toastr.error(res.data.message || 'Failed to cancel invoice');
        }
      })
      .catch((error) => {
        console.error('Cancel Error:', error);
        this.toastr.error('Failed to cancel invoice');
      });
  }

  deleteInvoice(invoiceId: number) {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return;
    }

    this.api.deleteInvoice(invoiceId)
      .then((res: any) => {
        if (res.data.status) {
          this.toastr.success('Invoice deleted successfully');
          this.loadInvoices();
        } else {
          this.toastr.error(res.data.message || 'Failed to delete invoice');
        }
      })
      .catch((error) => {
        console.error('Delete Error:', error);
        this.toastr.error('Failed to delete invoice');
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'paid':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '💰';
    }
  }

  
  formatAmount(amount: any): string {
  return Number(amount).toFixed(2);
}

  printInvoice(invoice: any) {
    // Create a printable invoice
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${invoice.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .details { margin: 20px 0; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Hospital Management System</h1>
              <h2>Invoice #${invoice.id}</h2>
            </div>
            <div class="details">
              <p><strong>Date:</strong> ${new Date(invoice.created_at).toLocaleDateString()}</p>
              <p><strong>Patient:</strong> ${invoice.patient_name}</p>
              <p><strong>Doctor:</strong> Dr. ${invoice.doctor_name}</p>
              <p><strong>Appointment Date:</strong> ${new Date(invoice.appointment_date).toLocaleDateString()}</p>
            </div>
            <table>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>Consultation Fee</td>
                <td>$${parseFloat(invoice.amount).toFixed(2)}</td>
              </tr>
            </table>
            <div class="total">
              <p>Total Amount: $${parseFloat(invoice.amount).toFixed(2)}</p>
              <p>Status: ${invoice.status.toUpperCase()}</p>
              ${invoice.payment_method ? `<p>Payment Method: ${invoice.payment_method}</p>` : ''}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
}