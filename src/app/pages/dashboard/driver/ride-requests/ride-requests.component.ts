import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CardRideRequestsComponent } from '../../../../components/cards/card-ride-requests/card-ride-requests.component';

@Component({
  selector: 'app-ride-requests',
  standalone: true,
  imports: [CommonModule , RouterModule , CardRideRequestsComponent],
  templateUrl: './ride-requests.component.html',
})
export class RideRequestsComponent {


  constructor(private authService : AuthService , private router : Router) { }

  onLogout(): void {
    this.authService.clearTokens();
    this.router.navigate(['/auth/login']);
  }

}
