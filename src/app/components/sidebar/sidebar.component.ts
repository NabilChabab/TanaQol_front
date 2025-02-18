import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../core/services/auth/auth.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  imports: [CommonModule , RouterModule],
  standalone: true,
})
export class SidebarComponent implements OnInit {
  collapseShow = "hidden";
  constructor(public authService : AuthService , public router : Router) {}

  ngOnInit() {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
