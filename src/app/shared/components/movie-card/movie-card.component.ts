import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../shared/models/movie.model';
import { Router } from '@angular/router';
import { UserListsService } from '../../../features/profile/services/user-lists.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  @Input() movie!: Movie; // ! indicates that this property will be initialized later
  constructor(private router: Router, private listServices: UserListsService) {}
  isFavorite:boolean=false;
  isWatchlist:boolean=false;

checkFavoriteStatus(movieId: string): void {
    this.listServices.isMovieInFavouriteList(movieId).subscribe({
      next: (isFavorite) => {
        this.isFavorite = isFavorite;
      },
      error: (err) => {
        console.error('Error checking favorite status:', err);
      }
    });
  }

  // New method to check watchlist status
  checkWatchlistStatus(movieId: string): void {
    this.listServices.isMovieInWatchlist(movieId).subscribe({
      next: (isWatchlist) => {
        this.isWatchlist = isWatchlist;
      },
      error: (err) => {
        console.error('Error checking watchlist status:', err);
      }
    });
  }

ToggleMovieToWatchlist() {
    if (!this.movie) return;

    const movieId = this.movie.id.toString();

    if (!this.isWatchlist) {
      this.listServices.addMovieToWatchlist(movieId).subscribe({
        next: () => {
          this.isWatchlist = true;
        },
        error: (err) => {
          console.error('Error adding to watchlist:', err);
        }
      });
    } else {
      this.listServices.removeMovieFromWatchlist(movieId).subscribe({
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
      this.listServices.removeMovieFromFavorites(id).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (err) => {
          console.error('Error removing from favorites:', err);
        }
      });
    } else {
      this.listServices.addMovieToFavorites(id).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (err) => {
          console.error('Error adding to favorites:', err);
        }
      });
    }
  }


  navigateToMovie(): void {
    this.router.navigate(['/movie-preview', this.movie.id]);
  }
  formatRating(rating: number): string {
    return rating.toFixed(1); // Formats to 1 decimal place
  }

  formatCount(count: number): string {
    return (count * 1000).toLocaleString(); // Formats with commas
  }

  formatDuration(minutes: number): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours} hr ${mins} min`;
    } else if (hours > 0) {
      return `${hours} hr`;
    } else {
      return `${mins} min`;
    }
  }
}
