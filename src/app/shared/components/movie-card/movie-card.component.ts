import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../shared/models/movie.model';
import { Router } from '@angular/router';
import { UserListsService } from '../../../features/profile/services/user-lists.service';

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

  AddToWatchList(id: string): void {
    this.listServices.addMovieToWatchlist(id);
  }
  
  AddToFavourite(id: string): void {
    this.listServices.addMovieToFavorites(id);
  }

  navigateToMovie(): void {
    this.router.navigate(['/movie-preview', this.movie.id]);
  }

  playTrailer(event: Event): void {
    event.stopPropagation(); // Prevent card click from triggering
    if (this.movie.trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${this.movie.trailerKey}`, '_blank');
    }
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
