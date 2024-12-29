import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-admin",
  standalone : true,
  templateUrl: "./admin.component.html",
  imports: [RouterModule],
})
export class AdminComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
