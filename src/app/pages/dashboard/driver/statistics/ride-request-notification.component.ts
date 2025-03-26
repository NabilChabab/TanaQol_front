import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ride-request-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="rideRequest" class="notification-container">
      <div class="notification-card">
        <div class="notification-header">
          <h3>New Ride Request</h3>
          <button class="close-btn" (click)="onClose()">×</button>
        </div>
        <div class="notification-body">
          <div class="ride-details">
            <div class="detail-item">
              <span class="label">Pickup:</span>
              <span class="value">{{ rideRequest.pickupLocation }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Destination:</span>
              <span class="value">{{ rideRequest.destination }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Price:</span>
              <span class="value">{{ rideRequest.price | currency }}</span>
            </div>
          </div>
        </div>
        <div class="notification-footer">
          <button class="accept-btn" (click)="onAccept()">Accept</button>
          <button class="decline-btn" (click)="onDecline()">Decline</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .notification-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      width: 350px;
    }

    .notification-header {
      background-color: #4299e1;
      color: white;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .notification-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    .notification-body {
      padding: 16px;
    }

    .ride-details {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
    }

    .label {
      font-weight: 600;
      color: #4a5568;
    }

    .value {
      color: #2d3748;
    }

    .notification-footer {
      display: flex;
      padding: 12px 16px;
      border-top: 1px solid #e2e8f0;
      gap: 12px;
    }

    .accept-btn, .decline-btn {
      flex: 1;
      padding: 8px 0;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: background-color 0.2s;
    }

    .accept-btn {
      background-color: #48bb78;
      color: white;
    }

    .accept-btn:hover {
      background-color: #38a169;
    }

    .decline-btn {
      background-color: #f56565;
      color: white;
    }

    .decline-btn:hover {
      background-color: #e53e3e;
    }
  `]
})
export class RideRequestNotificationComponent {
  @Input() rideRequest: any;
  @Output() accept = new EventEmitter<string>();
  @Output() decline = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  onAccept(): void {
    if (this.rideRequest && this.rideRequest.rideId) {
      this.accept.emit(this.rideRequest.rideId);
    }
  }

  onDecline(): void {
    if (this.rideRequest && this.rideRequest.rideId) {
      this.decline.emit(this.rideRequest.rideId);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}