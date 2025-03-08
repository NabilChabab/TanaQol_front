import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RideOptionsComponent } from '../../components/ride-options/ride-options2.component';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { RideService, Ride, RideType } from '../../core/services/ride/ride.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CITIES_API } from '../../app.constants';

interface City {
  id: number;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  main_places: MainPlace[];
}

interface MainPlace {
  id: number;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
}

interface Marker {
  position: google.maps.LatLngLiteral;
  title: string;
  icon?: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    CarouselModule,
    ButtonModule,
    TagModule,
    DropdownModule,
    ToastModule,
    RideOptionsComponent,
    GoogleMapsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [MessageService],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class IndexComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('map') map!: google.maps.Map;

  // Search inputs

  private cities_api = CITIES_API;
  pickupQuery: string = '';
  destinationQuery: string = '';
  pickupSuggestions: (City | MainPlace)[] = [];
  destinationSuggestions: (City | MainPlace)[] = [];

  // Selected locations
  selectedPickup: City | MainPlace | null = null;
  selectedDestination: City | MainPlace | null = null;

  // Data sources
  cities: City[] = [];
  allMainPlaces: MainPlace[] = [];

  // Map properties
  mapCenter: google.maps.LatLngLiteral = { lat: 33.6846, lng: -7.5000 };
  mapZoom: number = 6.5;
  mapMarkers: Marker[] = [];
  routePath: google.maps.LatLngLiteral[] = [];
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: '#4285F4',
    strokeOpacity: 1.0,
    strokeWeight: 5
  };

  // Booking form
  bookingForm: FormGroup;
  rideOptions = [
    { label: 'Standard', value: RideType.STANDARD },
    { label: 'Premium', value: RideType.PREMIUM },
    { label: 'Shared', value: RideType.SHARED }
  ];
  estimatedDistance: number = 0;
  estimatedPrice: number = 0;
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private rideService: RideService,
    private messageService: MessageService
  ) {
    this.bookingForm = this.fb.group({
      rideType: [RideType.STANDARD, Validators.required],
      pickupAddress: ['', Validators.required],
      destinationAddress: ['', Validators.required],
      pickupLat: [0, Validators.required],
      pickupLng: [0, Validators.required],
      destinationLat: [0, Validators.required],
      destinationLng: [0, Validators.required],
      price: [0],
      rideStatus: ['REQUESTED'],
      customer: { id: localStorage.getItem('authId') }, // Envoyer un objet avec un `id`
      driver: { id: '963440ad-339e-49da-aeb3-432417ae8137' } // Même chose pour le driver si nécessaire
    });

  }

  ngOnInit(): void {
    this.fetchCitiesData();
  }

  fetchCitiesData(): void {
    this.http
      .get<City[]>(this.cities_api)
      .subscribe((cities) => {
        this.cities = cities;
        this.allMainPlaces = cities.flatMap((city) => city.main_places || []);
      });
  }



  onPickupChange(): void {
    if (this.pickupQuery === '') {
      this.pickupSuggestions = [];
      return;
    }

    const query = this.pickupQuery.toLowerCase();
    const matchedCities = this.cities.filter((city) =>
      city.name.toLowerCase().includes(query)
    );
    const matchedPlaces = this.allMainPlaces.filter((place) =>
      place.name.toLowerCase().includes(query)
    );

    this.pickupSuggestions = [...matchedCities, ...matchedPlaces];
  }

  onDestinationChange(): void {
    if (this.destinationQuery === '') {
      this.destinationSuggestions = [];
      return;
    }

    const query = this.destinationQuery.toLowerCase();
    const matchedCities = this.cities.filter((city) =>
      city.name.toLowerCase().includes(query)
    );
    const matchedPlaces = this.allMainPlaces.filter((place) =>
      place.name.toLowerCase().includes(query)
    );

    this.destinationSuggestions = [...matchedCities, ...matchedPlaces];
  }

  onSelectPickup(location: City | MainPlace): void {
    this.selectedPickup = location;
    this.pickupQuery = location.name;
    this.pickupSuggestions = [];

    this.bookingForm.patchValue({
      pickupAddress: location.name,
      pickupLat: location.lat,
      pickupLng: location.lng
    });

    this.updateMap();
  }

  onSelectDestination(location: City | MainPlace): void {
    this.selectedDestination = location;
    this.destinationQuery = location.name;
    this.destinationSuggestions = [];

    this.bookingForm.patchValue({
      destinationAddress: location.name,
      destinationLat: location.lat,
      destinationLng: location.lng
    });

    this.updateMap();
  }

  updateMap(): void {
    this.mapMarkers = [];
    this.routePath = [];

    // Add pickup marker if selected
    if (this.selectedPickup) {
      this.mapMarkers.push({
        position: { lat: this.selectedPickup.lat, lng: this.selectedPickup.lng },
        title: 'Pickup: ' + this.selectedPickup.name,
        icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
      });
    }

    // Add destination marker if selected
    if (this.selectedDestination) {
      this.mapMarkers.push({
        position: { lat: this.selectedDestination.lat, lng: this.selectedDestination.lng },
        title: 'Destination: ' + this.selectedDestination.name,
        icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });
    }

    // If both pickup and destination are selected
    if (this.selectedPickup && this.selectedDestination) {
      // Center map to show both points
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(new google.maps.LatLng(this.selectedPickup.lat, this.selectedPickup.lng));
      bounds.extend(new google.maps.LatLng(this.selectedDestination.lat, this.selectedDestination.lng));

      // Adjust map to fit both points
      setTimeout(() => {
        this.map?.fitBounds(bounds);
      }, 100);

      // Get route between pickup and destination
      this.getRouteWithDistanceMatrix();
    } else if (this.selectedPickup) {
      // Only pickup selected, center on it
      this.mapCenter = { lat: this.selectedPickup.lat, lng: this.selectedPickup.lng };
      this.mapZoom = this.selectedPickup.zoom || 12;
    } else if (this.selectedDestination) {
      // Only destination selected, center on it
      this.mapCenter = { lat: this.selectedDestination.lat, lng: this.selectedDestination.lng };
      this.mapZoom = this.selectedDestination.zoom || 12;
    }
  }

  getRouteWithDistanceMatrix(): void {
    if (!this.selectedPickup || !this.selectedDestination) {
      return;
    }

    this.isLoading = true;

    // Create origin and destination points
    const origin = new google.maps.LatLng(this.selectedPickup.lat, this.selectedPickup.lng);
    const destination = new google.maps.LatLng(this.selectedDestination.lat, this.selectedDestination.lng);

    // Use Distance Matrix Service to get the distance
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === 'OK' && response) {
          try {
            // Get the distance in kilometers
            const distanceStr = response.rows[0].elements[0].distance.text;
            const distanceValue = response.rows[0].elements[0].distance.value / 1000; // Convert meters to km
            this.estimatedDistance = distanceValue;

            // Calculate price based on distance
            this.calculateEstimatedPrice();

            // Draw a path between points
            this.getPathWithDirectionsService(origin, destination);
          } catch (error) {
            console.error('Error processing distance matrix response:', error);
            this.createStraightLinePath();
          }
        } else {
          console.error('Distance Matrix Service failed:', status);
          this.createStraightLinePath();
        }
      }
    );
  }

  getPathWithDirectionsService(origin: google.maps.LatLng, destination: google.maps.LatLng): void {
    // Use the Directions Service for path finding (works with JavaScript Maps API)
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        this.isLoading = false;
        if (status === 'OK' && result) {
          // Extract path from the route
          const path: google.maps.LatLngLiteral[] = [];
          const route = result.routes[0];
          const legs = route.legs;

          // Process each leg
          for (let i = 0; i < legs.length; i++) {
            const steps = legs[i].steps;

            // Process each step in the leg
            for (let j = 0; j < steps.length; j++) {
              const nextSegment = steps[j].path;

              // Process each point in the step
              for (let k = 0; k < nextSegment.length; k++) {
                path.push({ lat: nextSegment[k].lat(), lng: nextSegment[k].lng() });
              }
            }
          }

          this.routePath = path;
        } else {
          console.error('Directions Service failed:', status);
          this.createStraightLinePath();
        }
      }
    );
  }

  // Fallback to straight line if DirectionsService fails
  createStraightLinePath(): void {
    if (!this.selectedPickup || !this.selectedDestination) {
      return;
    }

    this.isLoading = false;

    this.routePath = [
      { lat: this.selectedPickup.lat, lng: this.selectedPickup.lng },
      { lat: this.selectedDestination.lat, lng: this.selectedDestination.lng }
    ];

    // Calculate straight-line distance if we don't have it yet
    if (this.estimatedDistance === 0) {
      const R = 6371; // Earth's radius in km
      const dLat = this.deg2rad(this.selectedDestination.lat - this.selectedPickup.lat);
      const dLon = this.deg2rad(this.selectedDestination.lng - this.selectedPickup.lng);
      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(this.selectedPickup.lat)) * Math.cos(this.deg2rad(this.selectedDestination.lat)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      this.estimatedDistance = R * c; // Distance in km

      this.calculateEstimatedPrice();
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Simple Route',
      detail: 'Showing direct path between locations'
    });
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  calculateEstimatedPrice(): void {
    const rideType = this.bookingForm.get('rideType')?.value || RideType.STANDARD;
    this.estimatedPrice = this.rideService.calculatePrice(this.estimatedDistance, rideType);
    this.bookingForm.patchValue({ price: this.estimatedPrice });
  }

   onRideTypeChange(event: any): void {
    this.calculateEstimatedPrice();
  }

  bookRide(): void {
    if (this.bookingForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields.'
      });
      return;
    }

    this.isLoading = true;

    const ride: Ride = this.bookingForm.value;

    this.rideService.createRide(ride)
      .pipe(
        catchError(error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Booking Failed',
            detail: 'Could not book the ride. Please try again later.'
          });
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        if (response) {
          this.messageService.add({
            severity: 'success',
            summary: 'Ride Booked',
            detail: 'Your ride has been successfully booked!'
          });

          // Optionally: Redirect to ride details page
          // this.router.navigate(['/rides', response.id]);
        }
      });
  }
}
