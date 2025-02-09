import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, CarouselModule, ButtonModule, TagModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class IndexComponent implements OnInit {
  cars = [
    {
      name: 'Ford Focus RS',
      image: '../../../assets/img/ride.png',
      price: '22,000€',
      tag: 'Ride',
    },
    {
      name: 'Toyota Supra',
      image: '../../../assets/img/confort.png',
      price: '45,000€',
      tag: 'Comfort',
    },
    {
      name: 'Toyota Supra',
      image: '../../../assets/img/camper-van.png',
      price: '45,000€',
      tag: 'Family',
    },
    {
      name: 'Toyota Supra',
      image: '../../../assets/img/electric-motor.png',
      price: '45,000€',
      tag: 'Moto',
    },
    {
      name: 'Toyota Supra',
      image: '../../../assets/img/bus.png',
      price: '45,000€',
      tag: 'Bus',
    },
    {
      name: 'Nissan GT-R',
      image: '../../../assets/img/taxi.png',
      price: '80,000€',
      tag: 'Taxi',
    },
  ];

  currentIndex = 0;

  onPageChange(event: any) {
    this.currentIndex = event.page;
  }

  ngOnInit() {}
}
