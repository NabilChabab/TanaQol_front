import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-ride-options2',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <p-card styleClass="mb-4">
      <ng-template pTemplate="header">
        <h3 class="text-lg font-bold px-4 pt-4">Ride Options</h3>
      </ng-template>

      <div class="ride-option-list">
        <div *ngFor="let option of rideOptions" class="ride-option flex items-center p-2 border-b last:border-b-0">
          <div class="icon w-10 h-10 flex items-center justify-center bg-blue-50 rounded-full mr-3">
            <i [class]="option.icon"></i>
          </div>
          <div class="details flex-1">
            <h4 class="text-base font-medium">{{option.name}}</h4>
            <p class="text-sm text-gray-600">{{option.description}}</p>
          </div>
        </div>
      </div>
    </p-card>
  `,
  styles: [`
    .ride-option:hover {
      background-color: #f9fafb;
    }
  `]
})
export class RideOptionsComponent {
  rideOptions = [
    {
      name: 'Standard',
      description: 'Affordable rides for everyday use',
      icon: 'pi pi-car'
    },
    {
      name: 'Premium',
      description: 'Luxury vehicles with professional drivers',
      icon: 'pi pi-star'
    },
    {
      name: 'Shared',
      description: 'Split the cost with others going your way',
      icon: 'pi pi-users'
    }
  ];
}
