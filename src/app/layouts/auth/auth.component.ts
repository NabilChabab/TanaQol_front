import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";  // Import RouterModule
import { AuthNavbarComponent } from "../../components/navbars/auth-navbar/auth-navbar.component";
import { FooterSmallComponent } from "../../components/footers/footer-small/footer-small.component";


@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  standalone: true,
  imports: [AuthNavbarComponent, FooterSmallComponent, RouterModule],
})
export class AuthComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
