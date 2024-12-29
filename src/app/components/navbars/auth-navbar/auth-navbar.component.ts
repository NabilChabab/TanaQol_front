import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../core/services/auth/auth.service";
import { CommonModule } from "@angular/common";
import { Route, Router, RouterModule } from "@angular/router";


@Component({
  selector: "app-auth-navbar",
  standalone: true,
  templateUrl: "./auth-navbar.component.html",
  imports: [CommonModule , RouterModule],
})
export class AuthNavbarComponent implements OnInit {
  navbarOpen = false;

  constructor(public authService : AuthService , public router: Router) {}

  ngOnInit(): void {}

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  isLoginRoute(): boolean {
    return this.router.url === '/auth/login';
  }

  isRegisterRoute(): boolean {
    return this.router.url === '/auth/register';
  }

  
}
