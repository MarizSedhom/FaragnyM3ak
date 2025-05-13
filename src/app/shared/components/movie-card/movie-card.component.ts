import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../shared/models/movie.model';
import { Router } from '@angular/router';
import { UserListsService } from '../../../features/profile/services/user-lists.service';
import { environment } from '../../../../environments/environment';import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatPaginatorModule
  ],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  @Input() movie!: Movie; // ! indicates that this property will be initialized later
  @Output() statusChange = new EventEmitter<{ movieId: string, isFavorite: boolean, isWatchlist: boolean }>();
  @Input() isContinueWatching: boolean = false;
@Output() remove = new EventEmitter<string>();

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

  toggleFavorite(event: MouseEvent): void {
    // Prevent event bubbling to parent elements
    event.stopPropagation();
    
    if (!this.movie) return;

    const movieId = this.movie.id.toString();
    
    // Optimistically update the UI
    this.isFavorite = !this.isFavorite;

    // Emit the status change
    this.statusChange.emit({
      movieId,
      isFavorite: this.isFavorite,
      isWatchlist: this.isWatchlist
    });

    const action = this.isFavorite
      ? this.listServices.addMovieToFavorites(movieId)
      : this.listServices.removeMovieFromFavorites(movieId);

    action.subscribe({
      error: (err) => {
        // Revert the optimistic update if there's an error
        this.isFavorite = !this.isFavorite;
        console.error(`Error ${this.isFavorite ? 'adding to' : 'removing from'} favorites:`, err);
        // You could also show a toast/notification here to inform the user
      }
    });
  }

  toggleWatchlist(event: MouseEvent): void {
    // Prevent event bubbling to parent elements
    event.stopPropagation();
    
    if (!this.movie) return;

    const movieId = this.movie.id.toString();
    
    // Optimistically update the UI
    this.isWatchlist = !this.isWatchlist;

    // Emit the status change
    this.statusChange.emit({
      movieId,
      isFavorite: this.isFavorite,
      isWatchlist: this.isWatchlist
    });

    const action = this.isWatchlist
      ? this.listServices.addMovieToWatchlist(movieId)
      : this.listServices.removeMovieFromWatchlist(movieId);

    action.subscribe({
      error: (err) => {
        // Revert the optimistic update if there's an error
        this.isWatchlist = !this.isWatchlist;
        console.error(`Error ${this.isWatchlist ? 'adding to' : 'removing from'} watchlist:`, err);
        // You could also show a toast/notification here to inform the user
      }
    });
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
  onRemove(event: Event): void {
  event.stopPropagation(); // Prevent navigation
  this.remove.emit(String( this.movie.id));
}
}
