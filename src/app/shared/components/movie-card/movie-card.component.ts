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
  constructor(private router: Router, private listServices: UserListsService) { }
  isFavorite: boolean = false;
  isWatchlist: boolean = false;

  ngOnInit(): void {
    this.checkMovieStatuses();
  }
  

  checkMovieStatuses(): void {
    if (!this.movie) return;

    const movieId = this.movie.id.toString();

    this.listServices.isMovieInFavouriteList(movieId).subscribe({
      next: (isFav) => this.isFavorite = isFav,
      error: (err) => console.error('Error checking favorite status:', err)
    });

    this.listServices.isMovieInWatchlist(movieId).subscribe({
      next: (inWatchlist) => this.isWatchlist = inWatchlist,
      error: (err) => console.error('Error checking watchlist status:', err)
    });
  }

  toggleFavorite(): void {
    if (!this.movie) return;

    const movieId = this.movie.id.toString();

    const action = this.isFavorite
      ? this.listServices.removeMovieFromFavorites(movieId)
      : this.listServices.addMovieToFavorites(movieId);

    action.subscribe({
      next: () => this.isFavorite = !this.isFavorite,
      error: (err) => console.error(`Error ${this.isFavorite ? 'removing from' : 'adding to'} favorites:`, err)
    });
  }

  toggleWatchlist(): void {
    if (!this.movie) return;

    const movieId = this.movie.id.toString();

    const action = this.isWatchlist
      ? this.listServices.removeMovieFromWatchlist(movieId)
      : this.listServices.addMovieToWatchlist(movieId);

    action.subscribe({
      next: () => this.isWatchlist = !this.isWatchlist,
      error: (err) => console.error(`Error ${this.isWatchlist ? 'removing from' : 'adding to'} watchlist:`, err)
    });
  }

  /////////////////////////////////////////////////////////////////////////


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
