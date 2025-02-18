import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RideOptionsComponent } from '../../components/ride-options/ride-options.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, CarouselModule, ButtonModule, TagModule , RideOptionsComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class IndexComponent implements OnInit {

  ngOnInit() {}
}
