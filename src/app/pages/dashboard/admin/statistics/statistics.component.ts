import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CardPageVisitsComponent } from "../../../../components/cards/card-page-visits/card-page-visits.component";
import { CardSocialTrafficComponent } from "../../../../components/cards/card-social-traffic/card-social-traffic.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./statistics.component.html",
  standalone: true,
  imports: [RouterModule , CommonModule , CardPageVisitsComponent , CardSocialTrafficComponent],
})
export class StatisticsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
