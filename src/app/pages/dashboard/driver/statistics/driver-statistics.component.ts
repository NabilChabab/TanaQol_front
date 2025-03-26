import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CardPageVisitsComponent } from "../../../../components/cards/card-page-visits/card-page-visits.component";
import { CardSocialTrafficComponent } from "../../../../components/cards/card-social-traffic/card-social-traffic.component";
import { RideService } from "../../../../core/services/ride/ride.service";
import { WebSocketService } from "../../../../core/services/notificatons/websocket.service";
import { RideRequestNotificationComponent } from "./ride-request-notification.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./driver-statistics.component.html",
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    CardPageVisitsComponent,
    CardSocialTrafficComponent,
    RideRequestNotificationComponent
  ],
})
export class DriverStatisticsComponent implements OnInit, OnDestroy {
  rideRequest: any;

  constructor(private webSocketService: WebSocketService , private rideService : RideService) {}

  // In driver-statistics.component.ts
  ngOnInit(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.id) {
      console.log('Connecting WebSocket for user:', currentUser.id);
      this.webSocketService.connect(currentUser.id);

      // Subscribe to ride requests
      this.webSocketService.onRideRequest().subscribe((notification) => {
        console.log('New ride request received:', notification);
        this.rideRequest = notification; // Ensure this is set
      });
    }
  }
  getCurrentUser(): { id: string } | null {
    const userId = localStorage.getItem('authId');
    return userId ? { id: userId } : null;
  }

  acceptRide(rideId: string) {
    const currentUser = this.rideService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.rideService.acceptRide(rideId).subscribe({
        next: () => {
          console.log('Ride accepted');
          this.closeNotification();
        },
        error: (err) => console.error('Error accepting ride:', err)
      });
    }
  }

  refuseRide(rideId: string) {
    this.rideService.refuseRide(rideId).subscribe({
      next: () => {
        console.log('Ride refused');
        this.closeNotification();
      },
      error: (err) => console.error('Error refusing ride:', err)
    });
  }

  closeNotification() {
    this.rideRequest = null;
  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
  }
}