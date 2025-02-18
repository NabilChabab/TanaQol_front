import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CardRoleRequestsComponent } from '../../../../components/cards/card-role-requests/card-role-requests.component';

@Component({
  selector: 'app-role-requests',
  standalone: true,
  imports: [CommonModule , RouterModule , CardRoleRequestsComponent],
  templateUrl: './role-requests.component.html',
})
export class RoleRequestsComponent {


  constructor(private authService : AuthService , private router : Router) { }

  onLogout(): void {
    this.authService.clearTokens();
    this.router.navigate(['/auth/login']);
  }

}
