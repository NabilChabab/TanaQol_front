import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ride-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ride-options.component.html',
  styleUrl: './ride-options.component.css'
})
export class RideOptionsComponent {

  rideOptions = [
    { name: 'Ride', link: '#link' },
    { name: 'TanaQol Taxi', link: '' },
    { name: 'Comfort', link: '' },
    { name: 'Family', link: '' },
    { name: 'Moto', link: '' },
    { name: 'Bus', link: '' }
  ];

}
