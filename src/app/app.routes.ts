import {Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { RoleGuard } from './core/guards/roles/role.guard';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { LandingComponent } from './layouts/landing/landing.component';
import { IndexComponent } from './pages/landing/landing.component';
import { OAuth2CallbackComponent } from './pages/auth/oauth/oauth.component';
import { StatisticsComponent } from './pages/dashboard/admin/statistics/statistics.component';
import { DriverStatisticsComponent } from './pages/dashboard/driver/statistics/driver-statistics.component';
import { DriverComponent } from './layouts/driver/driver.component';
import { UsersComponent } from './pages/dashboard/admin/users/users.component';
import { VehicleComponent } from './pages/dashboard/admin/vehicles/vehicles.component';
import { RoleRequestsComponent } from './pages/dashboard/admin/role-requests/role-requests.component';
import { RideRequestsComponent } from './pages/dashboard/driver/ride-requests/ride-requests.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'login', component: LoginComponent},
      { path: 'register', component: RegisterComponent},
    ]
  },
  { path: 'auth/oauth2/callback', component: OAuth2CallbackComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: StatisticsComponent, canActivate : [RoleGuard], data: { role: 'ROLE_ADMIN' } },
      { path: 'role-requests', component: RoleRequestsComponent, canActivate : [RoleGuard], data: { role: 'ROLE_ADMIN' } },
      { path: 'users', component: UsersComponent, canActivate : [RoleGuard], data: { role: 'ROLE_ADMIN' } },
      { path: 'vehicles', component: VehicleComponent, canActivate : [RoleGuard], data: { role: 'ROLE_ADMIN' } },
    ]
  },
  {
    path: 'driver',
    component: DriverComponent,
    children: [
      { path: 'dashboard', component: DriverStatisticsComponent, canActivate : [RoleGuard], data: { role: 'ROLE_DRIVER' } },
      { path: 'ride-requests', component: RideRequestsComponent, canActivate : [RoleGuard], data: { role: 'ROLE_DRIVER' } },
    ]
  },
  {
    path: '',
    component : LandingComponent,
    children : [
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
      },
      {
        path: '',component : IndexComponent
      },
    ]

  }
];
