import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../core/services/admin/users/users.service';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-card-users',
  templateUrl: './card-users.component.html',
  standalone: true,
  imports: [CommonModule , TagModule],
})
export class CardUsersComponent implements OnInit {
  users: any[] = [];
  page: number = 0;
  size: number = 6;
  totalPages: number = 0;
  loading: boolean = false;

  constructor(
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.usersService.findUsers(this.page, this.size).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.users = data.content;
          this.totalPages = data.totalPages;
          this.loading = false;
        }, 500);
      },
      error: (err) => {
        console.error('Failed to load users', err);
      },
    });
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    this.page++;
    this.loadUsers();
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
