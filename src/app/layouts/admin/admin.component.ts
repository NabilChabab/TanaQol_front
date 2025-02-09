import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { AdminNavbarComponent } from "../../components/navbars/admin-navbar/admin-navbar.component";
import { HeaderStatsComponent } from "../../components/headers/header-stats/header-stats.component";
import { FooterAdminComponent } from "../../components/footers/footer-admin/footer-admin.component";

@Component({
  selector: "app-admin",
  standalone : true,
  templateUrl: "./admin.component.html",
  imports: [RouterModule ,SidebarComponent  , AdminNavbarComponent , HeaderStatsComponent , FooterAdminComponent  ],
})
export class AdminComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
