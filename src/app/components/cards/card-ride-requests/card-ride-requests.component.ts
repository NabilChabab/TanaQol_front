import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { RideService } from '../../../core/services/ride/ride.service';

@Component({
  selector: 'app-card-ride-requests',
  templateUrl: './card-ride-requests.component.html',
  standalone: true,
  imports: [CommonModule, TagModule],
})
export class CardRideRequestsComponent implements OnInit {
  requests: any[] = [];
  page: number = 0;
  size: number = 6;
  totalPages: number = 0;
  loading: boolean = false;
  driverId: string | null = null;
  selectedRequest: any = null;
  actionType: string = '';

  constructor(private rideRequestService: RideService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    const currentDriver = localStorage.getItem('authId');
    this.driverId = currentDriver || '';
    this.loading = true;
    this.rideRequestService.getRidesByDriver(this.driverId).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.requests = data;
          this.loading = false;
        }, 500);
      },
      error: (err) => {
        console.error('Failed to load requests', err);
      },
    });
  }

  openModal(action: string, request: any): void {
    this.selectedRequest = request;
    this.actionType = action;
    document.getElementById('modalActionText')!.innerText = action === 'ACCEPT' ? 'accepter' : 'rejeter';
    document.getElementById('confirmationModal')!.classList.remove('hidden');

    const confirmBtn = document.getElementById('confirmActionBtn');
    if (confirmBtn) {
      confirmBtn.onclick = () => this.confirmAction();
      confirmBtn.classList.add(action === 'ACCEPT' ? 'bg-green-600' : 'bg-red-500');
    }
  }

  closeModal(): void {
    document.getElementById('confirmationModal')!.classList.add('hidden');
  }

  confirmAction(): void {
    if (!this.selectedRequest) return;

    if (this.actionType === 'ACCEPT') {
      this.acceptRequest(this.selectedRequest.id);
      this.loadRequests();
    } else {
      this.rejectRequest(this.selectedRequest.id);
      this.loadRequests();
    }
    this.closeModal();
  }

  acceptRequest(requestId: string): void {
    this.rideRequestService.acceptRide(requestId).subscribe({
      next: () => {
        this.requests = this.requests.filter(req => req.id !== requestId);
        console.log('Request accepted successfully');
      },
      error: (err) => console.error('Error accepting request:', err),
    });
  }

  rejectRequest(requestId: string): void {
    this.rideRequestService.refuseRide(requestId).subscribe({
      next: () => {
        this.requests = this.requests.filter(req => req.id !== requestId);
        console.log('Request rejected successfully');
      },
      error: (err) => console.error('Error rejecting request:', err),
    });
  }
}
