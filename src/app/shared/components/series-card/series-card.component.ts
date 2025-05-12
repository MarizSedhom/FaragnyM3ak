import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() series!: Series;
  @Output() statusChange = new EventEmitter<{ seriesId: string, isFavorite: boolean, isWatchlist: boolean }>();

  constructor(private router: Router, private listServices: UserListsService) { }
  isFavorite: boolean = false;
  isWatchlist: boolean = false;

  ngOnInit(): void {
    this.checkSeriesStatuses();
  }

  checkSeriesStatuses(): void {
    if (!this.series) return;

    const seriesId = this.series.id.toString();

    this.listServices.isSeriesInFavouriteList(seriesId).subscribe({
      next: (isFav) => this.isFavorite = isFav,
      error: (err) => console.error('Error checking favorite status:', err)
    });

    this.listServices.isSeriesInWatchlist(seriesId).subscribe({
      next: (inWatchlist) => this.isWatchlist = inWatchlist,
      error: (err) => console.error('Error checking watchlist status:', err)
    });
  }

  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    
    if (!this.series) return;

    const seriesId = this.series.id.toString();
    
    // Optimistically update the UI
    this.isFavorite = !this.isFavorite;

    // Emit the status change
    this.statusChange.emit({
      seriesId,
      isFavorite: this.isFavorite,
      isWatchlist: this.isWatchlist
    });

    const action = this.isFavorite
      ? this.listServices.addSeriesToFavorites(seriesId)
      : this.listServices.removeSeriesFromFavorites(seriesId);

    action.subscribe({
      error: (err) => {
        // Revert the optimistic update if there's an error
        this.isFavorite = !this.isFavorite;
        console.error(`Error ${this.isFavorite ? 'adding to' : 'removing from'} favorites:`, err);
      }
    });
  }

  toggleWatchlist(event: MouseEvent): void {
    event.stopPropagation();
    
    if (!this.series) return;

    const seriesId = this.series.id.toString();
    
    // Optimistically update the UI
    this.isWatchlist = !this.isWatchlist;

    // Emit the status change
    this.statusChange.emit({
      seriesId,
      isFavorite: this.isFavorite,
      isWatchlist: this.isWatchlist
    });

    const action = this.isWatchlist
      ? this.listServices.addSeriesToWatchlist(seriesId)
      : this.listServices.removeSeriesFromWatchlist(seriesId);

    action.subscribe({
      error: (err) => {
        // Revert the optimistic update if there's an error
        this.isWatchlist = !this.isWatchlist;
        console.error(`Error ${this.isWatchlist ? 'adding to' : 'removing from'} watchlist:`, err);
      }
    });
  }

  navigateToSeries(): void {
    this.router.navigate(['/series-preview', this.series.id]);
  }

  formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  formatCount(count: number): string {
    return (count * 1000).toLocaleString();
  }
}
