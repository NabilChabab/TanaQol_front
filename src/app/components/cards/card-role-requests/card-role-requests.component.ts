import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { RoleRequestService } from '../../../core/services/admin/role-requests/role-requests.service';

@Component({
  selector: 'app-card-role-requests',
  templateUrl: './card-role-requests.component.html',
  standalone: true,
  imports: [CommonModule , TagModule],
})
export class CardRoleRequestsComponent implements OnInit {
  requests: any[] = [];
  page: number = 0;
  size: number = 6;
  totalPages: number = 0;
  loading: boolean = false;

  constructor(
    private roleRequestService: RoleRequestService,
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.roleRequestService.findAll(this.page, this.size).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.requests = data.content;
          this.totalPages = data.totalPages;
          this.loading = false;
        }, 500);
      },
      error: (err) => {
        console.error('Failed to load requests', err);
      },
    });
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadRequests();
    }
  }

  nextPage(): void {
    this.page++;
    this.loadRequests();
  }

  getInitials(username: string): string {
    return username
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getAvatarColor(username: string): string {
    const hash = Array.from(username).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    const color = `hsl(${hash % 360}, 30%, ${
      Math.floor(Math.random() * 10) + 20
    }%)`;
    return color;
  }
}
