import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Chart, ChartType } from "chart.js";
import Config from "chart.js/dist/core/core.config";

@Component({
  selector: "app-card-bar-chart",
  templateUrl: "./card-bar-chart.component.html",
})
export class CardBarChartComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const config = {
      type: "bar" as ChartType,
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: String(new Date().getFullYear()),
            backgroundColor: "#ed64a6",
            borderColor: "#ed64a6",
            data: [30, 78, 56, 34, 100, 45, 13],
            fill: false,
            barThickness: 8,
          },
          {
            label: String(new Date().getFullYear() - 1),
            fill: false,
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data: [27, 68, 86, 74, 10, 4, 87],
            barThickness: 8,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          title: {
            display: false,
            text: "Orders Chart",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
          legend: {
            labels: {
              color: "rgba(0,0,0,.4)",
            },
            align: "end",
            position: "bottom", // Correct and allowed value
          },
        },
        scales: {
          x: {
            display: false,
            title: {
              display: true,
              text: "Month",
            },
            grid: {
              borderDash: [2],
              color: "rgba(33, 37, 41, 0.3)",
              zeroLineColor: "rgba(33, 37, 41, 0.3)",
            },
          },
          y: {
            display: true,
            title: {
              display: false,
              text: "Value",
            },
            grid: {
              borderDash: [2],
              color: "rgba(33, 37, 41, 0.2)",
            },
          },
        },
      },
    };

    const ctx = (document.getElementById("bar-chart") as HTMLCanvasElement).getContext("2d");
    new Chart(ctx!, config);
  }
}
