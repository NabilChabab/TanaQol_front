import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRole = route.data['role'];
    const userRole = localStorage.getItem('role');

    if (userRole === requiredRole) {
      return true; 
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
