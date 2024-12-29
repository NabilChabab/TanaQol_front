import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";  // Import RouterModule
import { IndexNavbarComponent } from "../../components/navbars/index-navbar/index-navbar.component";
import { FooterComponent } from "../../components/footers/footer/footer.component";


@Component({
  selector: "app-auth",
  templateUrl: "./landing.component.html",
  standalone: true,
  imports: [IndexNavbarComponent, FooterComponent, RouterModule],
})
export class LandingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
