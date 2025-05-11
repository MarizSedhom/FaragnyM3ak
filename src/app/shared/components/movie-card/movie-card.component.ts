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

  
  ToggleToWatchList(id: string): void {
    //TODO: must check if the movie is already in the watchlist
    this.listServices.addMovieToWatchlist(id);
    //TODO: must remove the movie from the watchlist if it is already in the watchlist
    this.listServices.removeMovieFromWatchlist(id);
  }

  toggleFavorite(id: string): void { 
    //TODO: must check if the movie is already in the favorites list
    this.listServices.addMovieToFavorites(this.movie!.id.toString())
    //TODO: must remove the movie from the favorites list if it is already in the favorites list
    this.listServices.removeMovieFromFavorites(this.movie!.id.toString())
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
