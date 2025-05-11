import { Component, Input } from '@angular/core';
import { Series } from '../../models/series.model';
import { Router } from '@angular/router';
import { UserListsService } from '../../../features/profile/services/user-lists.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-series-card',
  imports: [CommonModule],
  templateUrl: './series-card.component.html',
  styleUrls: ['./series-card.component.scss']
})
export class SeriesCardComponent {
  @Input() series!: Series; // ! indicates that this property will be initialized later

  constructor(private router: Router, private listServices: UserListsService) { }
  isFavorite: boolean = false;
  isWatchlist: boolean = false;

checkFavoriteStatus(seriesId: string): void {
    this.listServices.isSeriesInFavouriteList(seriesId).subscribe({
      next: (isFavorite) => {
        this.isFavorite = isFavorite;
      },
      error: (err) => {
        console.error('Error checking favorite status:', err);
      }
    });
  }

  // New method to check watchlist status
  checkWatchlistStatus(seriesId: string): void {
    this.listServices.isSeriesInWatchlist(seriesId).subscribe({
      next: (isWatchlist) => {
        this.isWatchlist = isWatchlist;
      },
      error: (err) => {
        console.error('Error checking watchlist status:', err);
      }
    });
  }

ToggleSeriesToWatchlist() {
    if (!this.series) return;

    const seriesId = this.series.id.toString();

    if (!this.isWatchlist) {
      this.listServices.addSeriesToWatchlist(seriesId).subscribe({
        next: () => {
          this.isWatchlist = true;
        },
        error: (err) => {
          console.error('Error adding to watchlist:', err);
        }
      });
    } else {
      this.listServices.removeSeriesFromWatchlist(seriesId).subscribe({
        next: () => {
          this.isWatchlist = false;
        },
        error: (err) => {
          console.error('Error removing from watchlist:', err);
        }
      });
    }
  }

toggleFavorite(id: string): void {
    if (this.isFavorite) {
      this.listServices.removeSeriesFromFavorites(id).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (err) => {
          console.error('Error removing from favorites:', err);
        }
      });
    } else {
      this.listServices.addSeriesToFavorites(id).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (err) => {
          console.error('Error adding to favorites:', err);
        }
      });
    }
  }

  navigateToSeries(): void {
    this.router.navigate(['/series-preview', this.series.id]);
  }

  formatRating(rating: number): string {
    return rating.toFixed(1); // Formats to 1 decimal place
  }

  formatCount(count: number): string {
    return (count * 1000).toLocaleString(); // Formats with commas
  }
}
