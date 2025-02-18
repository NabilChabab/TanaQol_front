import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../core/services/admin/vehicles/vehicle.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-card-admin-vehicles',
  templateUrl: './card-admin-vehicles.component.html',
  styleUrls: ['./card-admin-vehicles.component.css'],
  standalone: true,
  imports: [CommonModule, DialogModule],
})
export class AdminCardVehiclesComponent implements OnInit {


  vehicles: any[] = [];
  page: number = 0;
  size: number = 6;
  totalPages: number = 0;
  loading: boolean = false;
  visible: boolean = false;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  showDialog() {
    this.visible = true;
  }
  loadVehicles(): void {
    this.loading = true;
    this.vehicleService.findAll(this.page, this.size).subscribe({
      next: data => {
        this.vehicles = data.content
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching Vehicles:', err);
      },
    });
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadVehicles();
    }
  }

  nextPage(): void {
    this.page++;
    this.loadVehicles();
  }



}
