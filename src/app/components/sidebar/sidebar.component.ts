import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../core/services/auth/auth.service";
import { MenuItem } from "primeng/api";
import { UserState } from "../../core/store/user/user.state";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  imports: [CommonModule , RouterModule],
  standalone: true,
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] | undefined;
  navbarOpen = false;
  user$: Observable<UserState>;
  username: string | null = null;
  googleUsername: string | null = null;
  role: string | null = null;
  isAuthenticated = false;
  profilePicture: string | null = null;
  defaultProfilePicture = 'https://i.pravatar.cc/150';
  visible2: boolean = false;

  isDrawerOpen = false;

  collapseShow = "hidden";



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
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
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

  isAdmin(): boolean {
    return this.role === 'ROLE_ADMIN';
  }

  isDriver(): boolean {
    return this.role === 'ROLE_DRIVER';
  }
}