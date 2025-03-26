import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL, MAP_KEY } from '../../../app.constants';
import { NotificationService } from '../notificatons/notifications.service';

export enum RideStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum RideType {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  SHARED = 'SHARED',
}

export interface Ride {
  id?: string;
  rideType: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupLat: number;
  pickupLng: number;
  destinationLat: number;
  destinationLng: number;
  pickupTime?: string;
  price: number;
  rideStatus: RideStatus;
  customer: any;
  driver: any;
}

@Injectable({
  providedIn: 'root',
})
export class RideService {
  private apiUrl = API_BASE_URL;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  createRide(ride: Ride): Observable<Ride> {
    // Get customerId from localStorage if not provided
    if (!ride.customer) {
      const currentUser = JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );
      if (currentUser && currentUser.id) {
        ride.customer = { id: currentUser.id };
      }
    }

    // Set default status if not provided
    if (!ride.rideStatus) {
      ride.rideStatus = RideStatus.REQUESTED;
    }

    return this.http.post<Ride>(`${this.apiUrl}/rides/save`, ride).pipe(
      tap({
        next: () =>
          this.notificationService.showSuccess(
            'Let\'s go!',
            'Your ride has been requested'
          ),
        error: () =>
          this.notificationService.showError(
            'Registration Failed',
            'Please check your details and try again'
          ),
      })
    );
  }

  getRide(id: string): Observable<Ride> {
    return this.http.get<Ride>(`${this.apiUrl}/rides/${id}`);
  }

  getRidesByCustomer(customerId: string): Observable<Ride[]> {
    return this.http.get<Ride[]>(`${this.apiUrl}/rides/customer/${customerId}`);
  }

  getRidesByDriver(driverId: string): Observable<Ride[]> {
    return this.http.get<Ride[]>(`${this.apiUrl}/rides/driver/${driverId}`);
  }

  getRidesByStatus(status: string): Observable<Ride[]> {
    return this.http.get<Ride[]>(`${this.apiUrl}/rides/status/${status}`);
  }

  updateRideStatus(rideId: string, status: string): Observable<Ride> {
    return this.http.put<Ride>(
      `${this.apiUrl}/rides/${rideId}/status?status=${status}`,
      {}
    );
  }

  assignDriver(rideId: string, driverId: string): Observable<Ride> {
    return this.http.put<Ride>(
      `${this.apiUrl}/rides/${rideId}/assign/${driverId}`,
      {}
    );
  }

  // Calculate price based on distance and ride type
  calculatePrice(distance: number, rideType: string): number {
    const basePrice = 15.0; // Base price in MAD
    const pricePerKm = 2.5; // Price per km in MAD

    let multiplier = 1.0;
    switch (rideType) {
      case RideType.PREMIUM:
        multiplier = 1.5;
        break;
      case RideType.SHARED:
        multiplier = 0.7;
        break;
      default: // STANDARD
        multiplier = 1.0;
    }

    return (basePrice + distance * pricePerKm) * multiplier;
  }

  // Calculate estimated distance using Google Maps Distance Matrix API
  calculateDistance(
    origin: google.maps.LatLng,
    destination: google.maps.LatLng
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK' && response) {
            const distance = response.rows[0].elements[0].distance.value / 1000; // Convert to km
            resolve(distance);
          } else {
            reject('Error calculating distance');
          }
        }
      );
    });
  }

  // Get user's current location
  getCurrentLocation(): Promise<google.maps.LatLngLiteral> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject('Geolocation permission denied');
          }
        );
      } else {
        reject('Geolocation not supported');
      }
    });
  }

  // Get current user from localStorage
  getCurrentUser(): { id: string } | null {
    const userId = localStorage.getItem('authId'); // Assuming the ID is stored as 'userId'
    return userId ? { id: userId } : null; // Return an object with the `id` property
  }

  calculateRoute(
    origin: google.maps.LatLng,
    destination: google.maps.LatLng
  ): Promise<any> {
    const apiKey = MAP_KEY;
    const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

    const requestBody = {
      origin: {
        location: {
          latLng: {
            latitude: origin.lat(),
            longitude: origin.lng(),
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.lat(),
            longitude: destination.lng(),
          },
        },
      },
      travelMode: 'DRIVE',
    };

    return this.http
      .post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask':
            'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
        },
      })
      .toPromise();
  }

  acceptRide(rideId: any) {
    return this.http.post(`${this.apiUrl}/rides/${rideId}/accept`, null);
  }

  refuseRide(rideId: any) {
    return this.http.post(`${this.apiUrl}/rides/${rideId}/refuse`, null);
  }
}
