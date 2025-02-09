import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LatestCompetitionsService } from '../../../core/services/landing/latest-competitions.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-card-admin-competitions',
  templateUrl: './card-admin-competitions.component.html',
  styleUrls: ['./card-admin-competitions.component.css'],
  standalone: true,
  imports: [CommonModule, DialogModule],
})
export class AdminCardCompetitionsComponent implements OnInit {
  public getCountryCodeFromLocation(location: string): string {
    // Common countries and cities mapping
    const locationMapping: { [key: string]: string } = {
      'Morocco': 'ma',
      'East Timor': 'tl',
      'Ireland': 'ie',
      'Japan': 'jp',
      'Brazil': 'br',
      'Indonesia': 'id',
      'Thailand': 'th',
      'China': 'cn',
      'Argentina': 'ar',
      'France': 'fr',
      'Russia': 'ru',
      // United States cities
      'New York': 'us',
      'Los Angeles': 'us',
      'Chicago': 'us',
      'Houston': 'us',
      'San Francisco': 'us',

      // UK cities
      'London': 'gb',
      'Manchester': 'gb',
      'Liverpool': 'gb',
      'Birmingham': 'gb',

      // France cities
      'Paris': 'fr',
      'Lyon': 'fr',
      'Marseille': 'fr',

      // Germany cities
      'Berlin': 'de',
      'Munich': 'de',
      'Hamburg': 'de',

      // Spain cities
      'Madrid': 'es',
      'Barcelona': 'es',
      'Valencia': 'es',

      // Italy cities
      'Rome': 'it',
      'Milan': 'it',
      'Venice': 'it',

      // Japan cities
      'Tokyo': 'jp',
      'Osaka': 'jp',
      'Kyoto': 'jp',

      // China cities
      'Beijing': 'cn',
      'Shanghai': 'cn',
      'Shenzhen': 'cn',

      // Canada cities
      'Toronto': 'ca',
      'Vancouver': 'ca',
      'Montreal': 'ca',

      // Australia cities
      'Sydney': 'au',
      'Melbourne': 'au',
      'Brisbane': 'au'
    };

    // Clean up the input location
    const cleanLocation = location.trim();

    // Check direct mapping
    return locationMapping[cleanLocation]?.toLowerCase() || 'unknown';
  }

  competitions: any[] = [];
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  loading: boolean = false;

  visible: boolean = false;

  private randomImages: string[] = ['assets/img/index2.jpg', 'assets/img/index.jpg', 'assets/img/index4.jpg', 'assets/img/index3.jpg'];

  constructor(private competitionService: LatestCompetitionsService) {}

  ngOnInit(): void {
    this.loadCompetitions();
  }

  showDialog() {
    this.visible = true;
  }

  private getUniqueRandomImages(count: number): string[] {
    const shuffled = [...this.randomImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  loadCompetitions(): void {
    this.loading = true;
    this.competitionService.findLatestCompetitions(this.page, this.size).subscribe({
      next: data => {
        const uniqueImages = this.getUniqueRandomImages(data.content.length);
        this.competitions = data.content.map((comp: any, index: any) => ({
          ...comp,
          imageUrl: uniqueImages[index],
        }));
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching competitions:', err);
      },
    });
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadCompetitions();
    }
  }

  // Go to the next page
  nextPage(): void {
    this.page++;
    this.loadCompetitions();
  }



}
