import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { RoleGuard } from './core/guards/roles/role.guard';
import { UsersComponent } from './pages/dashboard/admin/users/users.component';
import { CompetitionsComponent } from './pages/dashboard/member/competitions/competitions.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { LandingComponent } from './layouts/landing/landing.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { IndexComponent } from './pages/landing/landing.component';
import { OAuth2CallbackComponent } from './pages/auth/oauth/oauth.component';

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
    path: 'dashboard',
    component: AdminComponent,
    children: [
      { path: 'admin', component: UsersComponent, canActivate : [RoleGuard], data: { role: 'ROLE_ADMIN' } },
      { path: 'member', component: CompetitionsComponent, canActivate : [RoleGuard] , data: { role: 'ROLE_MEMBER' } },
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
        path: 'index',component : IndexComponent
      },
      {
        path: 'profile',component : ProfileComponent , canActivate : [RoleGuard] , data: { role: ['ROLE_ADMIN', 'ROLE_MEMBER' , 'ROLE_JURY'] }
      }
    ]

  }
];
