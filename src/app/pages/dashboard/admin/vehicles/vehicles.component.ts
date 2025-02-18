import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AdminCardVehiclesComponent } from '../../../../components/cards/card-admin-vehicles/card-admin-vehicles.component';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule , RouterModule , AdminCardVehiclesComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehicleComponent {


  constructor(private authService : AuthService , private router : Router) { }

  onLogout(): void {
    this.authService.clearTokens();
    this.router.navigate(['/auth/login']);
  }
}
