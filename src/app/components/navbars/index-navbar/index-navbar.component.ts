import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserState } from '../../../core/store/user/user.state';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-index-navbar',
  templateUrl: './index-navbar.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, MenuModule],
})
export class IndexNavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  navbarOpen = false;
  user$: Observable<UserState>;
  username: string | null = null;
  googleUsername: string | null = null;
  role: string | null = null;
  isAuthenticated = false;
  profilePicture: string | null = null;
  defaultProfilePicture = '../../../../assets/img/avatar.jfif';

  constructor(
    public authService: AuthService,
    private router: Router,
    private store: Store<{ user: UserState }>,
  ) {
    this.user$ = this.store.select('user');
  }

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    this.user$.subscribe(user => {
      this.username = user.username;
      this.isAuthenticated = user.isAuthenticated;
      this.role = user.role;
    });

    if (userInfo) {
      this.googleUsername = userInfo.name;
      this.profilePicture = userInfo.picture;
      this.isAuthenticated = true;
    } else {
      this.profilePicture = this.defaultProfilePicture;
    }

    console.log(this.role);
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'dashboard',
            icon: 'pi pi-home',
            command: () => {
              if (this.role === 'ROLE_ADMIN') {
                this.router.navigate(['/dashboard/admin']);
              }
            },
          },
          {
            label: 'profile',
            icon: 'pi pi-user',
            command: () => this.router.navigate(['/profile']),
          },
          {
            label: 'settings',
            icon: 'pi pi-cog',
          },
          {
            label: 'sign out',
            icon: 'pi pi-sign-out',
            command: () => this.logout(),
          },
        ],
      },
    ];
  }

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  isAuthenticatedWithGoogle(): boolean {
    return !!this.authService.getOauthToken();
  }
}
