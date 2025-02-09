import { Component, OnInit } from "@angular/core";
import { MembersService } from "../../../core/services/admin/members/members.service";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Route } from "@angular/router";

@Component({
  selector: "app-card-members",
  templateUrl: "./card-members.component.html",
  standalone: true,
  imports: [CommonModule],
})
export class CardMembersComponent implements OnInit {
  members: any[] = [];
  page: number = 0;
  size: number = 6;
  totalPages: number = 0;
  loading: boolean = false;

  constructor(private membersService: MembersService , private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data)=>{
      this.members = data['members'].content;
      this.totalPages = data['members'].totalPages;
    })
  }

  loadMembers(): void {
    this.loading = true;
    this.membersService.findMembers(this.page, this.size).subscribe({
      next: (data) => {
        this.members = data.content;
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error("Failed to load members", err);
      },
    });
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadMembers();
    }
  }

  nextPage(): void {
    this.page++;
    this.loadMembers();
  }

  getInitials(username: string): string {
    return username.split(' ').map(word => word[0].toUpperCase()).slice(0, 2).join('');
  }

  getAvatarColor(username: string): string {
    const hash = Array.from(username).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = `hsl(${hash % 360}, 30%, ${Math.floor(Math.random() * 10) + 20}%)`;
    return color;
  }
}
