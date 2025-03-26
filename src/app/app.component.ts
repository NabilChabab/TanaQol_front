// app.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { WebSocketService } from './core/services/notificatons/websocket.service';
import { RideRequestNotificationComponent } from './pages/dashboard/driver/statistics/ride-request-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ToastModule, CommonModule, RideRequestNotificationComponent],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
      <!-- Ride Request Notification Component -->
      <app-ride-request-notification
        *ngIf="activeRideRequest"
        [rideRequest]="activeRideRequest"
        (accept)="onAcceptRide($event)"
        (decline)="onDeclineRide($event)"
        (close)="onCloseNotification()">
      </app-ride-request-notification>

      <p-toast position="bottom-center"></p-toast>
    </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'x-leagues-front';
  activeRideRequest: any = null;
  userId: string | null = null;
  wsConnected = false;
  debugMode = true; // Set to false in production

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    // Initialize WebSocket connection
    this.initWebSocket();
  }

  ngOnDestroy(): void {
    // Disconnect from WebSocket when component is destroyed
    this.webSocketService.disconnect();
  }

  initWebSocket(): void {
    // Get current user ID
    const currentUser = this.getCurrentUser();
    this.userId = currentUser?.id || null;

    if (this.userId) {
      console.log('[APP] Connecting WebSocket for user:', this.userId);

      // Connect to WebSocket
      this.webSocketService.connect(this.userId);

      // Check connection status
      this.wsConnected = this.webSocketService.isConnected();

      // Subscribe to connection status changes
      this.webSocketService.connectionStatus().subscribe(status => {
        console.log('[APP] WebSocket connection status changed:', status);
        this.wsConnected = status;
      });

      // Subscribe to ride request notifications
      this.webSocketService.onRideRequest().subscribe(notification => {
        console.log('[APP] Received ride request notification:', notification);
        this.activeRideRequest = notification;
      });
    } else {
      console.error('[APP] No user ID available for WebSocket connection');
    }
  }

  getCurrentUser(): { id: string } | null {
    const userId = localStorage.getItem('authId');
    console.log('[APP] User ID from localStorage:', userId);
    return userId ? { id: userId } : null;
  }

  onAcceptRide(rideId: string): void {
    console.log('[APP] Accepting ride:', rideId);
    // Implement ride acceptance logic here
    this.activeRideRequest = null;
  }

  onDeclineRide(rideId: string): void {
    console.log('[APP] Declining ride:', rideId);
    // Implement ride decline logic here
    this.activeRideRequest = null;
  }

  onCloseNotification(): void {
    console.log('[APP] Closing notification');
    this.activeRideRequest = null;
  }

  testNotification(): void {
    console.log('[APP] Creating test notification');
    const testNotification = {
      rideId: 'test-123',
      pickupLocation: 'Test Pickup',
      destination: 'Test Destination',
      price: 25.99
    };

    this.activeRideRequest = testNotification;
    console.log('[APP] Test notification created:', this.activeRideRequest);
  }
}