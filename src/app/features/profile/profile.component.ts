import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Review, UserListsService } from './services/user-lists.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';
import { SeriesService } from '../../services/series.service';
import { MovieCardComponent } from "../../shared/components/movie-card/movie-card.component";
import { SeriesCardComponent } from "../../shared/components/series-card/series-card.component";
import { Movie } from '../../shared/models/movie.model';
import { Series } from '../../shared/models/series.model';

export type MediaItem = (Movie & { type: 'movie', isFavorite: boolean, watched: boolean, progress: number, timeLeft: number })
  | (Series & { type: 'series', isFavorite: boolean, watched: boolean, progress: number, timeLeft: number });

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DragDropModule, MovieCardComponent, SeriesCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  // Pagination for each section
  currentContinueIndex: number = 0;
  currentWatchlistIndex: number = 0;
  currentFavoritesIndex: number = 0;

  // Number of items to display per page
  readonly itemsPerPage: number = 4;
  readonly scrollAmount: number = 300;

  // User list IDs from Firestore
  moviesFavorites: string[] = [];
  moviesWatchlist: string[] = [];
  moviesTracking: string[] = [];
  moviesReviews: Review[] = [];

  seriesFavorites: string[] = [];
  seriesWatchlist: string[] = [];
  seriesTracking: string[] = [];
  seriesReviews: Review[] = [];

  // MediaItems that will be filled with actual data from TheMovieDB API
  mediaItems: MediaItem[] = [];
  isLoading: boolean = true;

  // For template variables
  movie: Movie[] = [];
  series: Series[] = [];

  // Scroll container references
  @ViewChild('continueScroll') continueScroll!: ElementRef;
  @ViewChild('watchlistScroll') watchlistScroll!: ElementRef;
  @ViewChild('favoritesScroll') favoritesScroll!: ElementRef;

  // filtering tabs
  filters = [
    { label: 'All', value: 'all' },
    { label: 'Watched', value: 'watched' },
    { label: 'Unwatched', value: 'unwatched' },
    { label: 'In Progress', value: 'in-progress' }
  ];
  selectedFilter = 'all';

  constructor(
    private userListsService: UserListsService,
    private auth: Auth,
    private router: Router,
    private movieService: MovieService,
    private seriesService: SeriesService
  ) { }

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.loadUserData();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  private loadUserData() {
    this.isLoading = true;

    // Get user lists from Firestore
    this.userListsService.getUserLists().pipe(
      switchMap(lists => {
        // Store the raw ID lists
        this.moviesFavorites = lists.movies?.favorites || [];
        this.moviesWatchlist = lists.movies?.watchlist || [];
        this.moviesTracking = lists.movies?.tracking || [];
        this.moviesReviews = lists.movies?.reviews || [];

        this.seriesFavorites = lists.series?.favorites || [];
        this.seriesWatchlist = lists.series?.watchlist || [];
        this.seriesTracking = lists.series?.tracking || [];
        this.seriesReviews = lists.series?.reviews || [];

        // Collect all unique movie IDs
        const movieIds = [
          ...this.moviesFavorites,
          ...this.moviesWatchlist,
          ...this.moviesTracking,
        ];

        // Collect all unique series IDs
        const seriesIds = [
          ...this.seriesFavorites,
          ...this.seriesWatchlist,
          ...this.seriesTracking
        ];

        // Fetch movie details from TheMovieDB API
        const movieRequests = movieIds.map(id =>
          this.movieService.getMovieById(id).pipe(
            map(movieData => {
              const mediaItem: MediaItem = {
                ...movieData,
                type: 'movie',
                isFavorite: this.moviesFavorites.includes(movieData.id.toString()),
                watched: this.moviesTracking.includes(movieData.id.toString()),
                progress: this.moviesTracking.includes(movieData.id.toString()) ? 50 : 0,
                timeLeft: 0
              };
              return mediaItem;
            }),
            catchError(() => of(null))
          )
        );

        // Fetch series details from TheMovieDB API
        const seriesRequests = seriesIds.map(id =>
          this.seriesService.getSeriesById(id).pipe(
            map(seriesData => {
              const mediaItem: MediaItem = {
                ...seriesData,
                type: 'series',
                isFavorite: this.seriesFavorites.includes(seriesData.id.toString()),
                watched: this.seriesTracking.includes(seriesData.id.toString()),
                progress: this.seriesTracking.includes(seriesData.id.toString()) ? 50 : 0,
                timeLeft: 0
              };
              return mediaItem;
            }),
            catchError(() => of(null))
          )
        );

        console.log("movieRequests", movieRequests);
        console.log("seriesRequests", seriesRequests);
        // Combine all requests
        return forkJoin([...movieRequests, ...seriesRequests]);
      })
    ).subscribe(results => {
      this.mediaItems = results.filter(item => item !== null) as MediaItem[];
      this.isLoading = false;
      console.log('WatchList:', this.watchList);

    });
  }

  // Pagination controls for Continue Watching
  prevContinue() {
    if (this.currentContinueIndex > 0) {
      this.currentContinueIndex--;
      this.scrollSection('continue', -1);
    }
  }

  nextContinue() {
    const maxItems = this.continueWatching.length;
    const maxPages = Math.ceil(maxItems / this.itemsPerPage);

    if (this.currentContinueIndex < maxPages - 1) {
      this.currentContinueIndex++;
      this.scrollSection('continue', 1);
    }
  }


  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  isWatched(item: MediaItem): boolean {
    if (item.type === 'movie') {
      return !!item.watched;
    }

    // For series, we'd check if all episodes are watched
    // Implementation depends on Series model structure
    return false;
  }

  isUnwatched(item: MediaItem): boolean {
    if (item.type === 'movie') {
      return !item.watched && (item.progress || 0) === 0;
    }

    // For series, check if no episodes have been watched
    return false;
  }

  isInProgress(item: MediaItem): boolean {
    if (item.type === 'movie') {
      return (item.progress || 0) > 0 && (item.progress || 0) < 100;
    }
    // For series, check if some episodes are in progress
    return false;
  }

  applyFilter(items: MediaItem[]): MediaItem[] {
    return items.filter(item => {
      switch (this.selectedFilter) {
        case 'watched': return this.isWatched(item);
        case 'unwatched': return this.isUnwatched(item);
        case 'in-progress': return this.isInProgress(item);
        default: return true;
      }
    });
  }

  get watchList(): MediaItem[] {
    const seen = new Set();
    return this.applyFilter(this.mediaItems.filter(item =>
      (
        (item.type === 'movie' && this.moviesWatchlist.includes(item.id.toString())) ||
        (item.type === 'series' && this.seriesWatchlist.includes(item.id.toString()))
      ) &&
      !seen.has(item.id) && seen.add(item.id)
    ));
  }

  get favorites(): MediaItem[] {
    const seen = new Set();
    return this.applyFilter(this.mediaItems.filter(item =>
      (
        (item.type === 'movie' && this.moviesFavorites.includes(item.id.toString())) ||
        (item.type === 'series' && this.seriesFavorites.includes(item.id.toString()))
      ) &&
      !seen.has(item.id) && seen.add(item.id)
    ));
  }

  get continueWatching(): MediaItem[] {
    const seen = new Set();
    return this.mediaItems.filter(item => (
      (item.type === 'movie' && this.moviesTracking.includes(item.id.toString())) ||
      (item.type === 'series' && this.seriesTracking.includes(item.id.toString()))
    )
      &&
      !seen.has(item.id) && seen.add(item.id)
    );
  }

  // Type guard functions to use in template
  isMovie(item: MediaItem): item is (Movie & { type: 'movie', isFavorite: boolean, watched: boolean, progress: number, timeLeft: number }) {
    return item.type === 'movie';
  }

  isSeries(item: MediaItem): item is (Series & { type: 'series', isFavorite: boolean, watched: boolean, progress: number, timeLeft: number }) {
    return item.type === 'series';
  }

  scrollSection(section: 'continue' | 'watchlist' | 'favorites', direction: number) {
    const container = this.getScrollContainer(section);
    if (!container) return;

    const scrollAmount = this.scrollAmount * direction;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  private getScrollContainer(section: string): HTMLElement | null {
    switch (section) {
      case 'continue': return this.continueScroll?.nativeElement;
      case 'watchlist': return this.watchlistScroll?.nativeElement;
      case 'favorites': return this.favoritesScroll?.nativeElement;
      default: return null;
    }
  }

  // Helper functions for pagination buttons
  canGoBack(section: 'continue' | 'watchlist' | 'favorites'): boolean {
    switch (section) {
      case 'continue': return this.currentContinueIndex > 0;
      case 'watchlist': return this.currentWatchlistIndex > 0;
      case 'favorites': return this.currentFavoritesIndex > 0;
      default: return false;
    }
  }

  canGoForward(section: 'continue' | 'watchlist' | 'favorites'): boolean {
    let maxPages = 0;
    let currentIndex = 0;

    switch (section) {
      case 'continue':
        maxPages = Math.ceil(this.continueWatching.length / this.itemsPerPage);
        currentIndex = this.currentContinueIndex;
        break;
      case 'watchlist':
        maxPages = Math.ceil(this.watchList.length / this.itemsPerPage);
        currentIndex = this.currentWatchlistIndex;
        break;
      case 'favorites':
        maxPages = Math.ceil(this.favorites.length / this.itemsPerPage);
        currentIndex = this.currentFavoritesIndex;
        break;
    }

    return currentIndex < maxPages - 1;
  }

  // Add these new methods to handle immediate updates
  updateMovieStatus(movieId: string, isFavorite: boolean, isWatchlist: boolean): void {
    // Update the local arrays immediately
    if (isFavorite) {
      if (!this.moviesFavorites.includes(movieId)) {
        this.moviesFavorites.push(movieId);
      }
    } else {
      this.moviesFavorites = this.moviesFavorites.filter(id => id !== movieId);
    }

    if (isWatchlist) {
      if (!this.moviesWatchlist.includes(movieId)) {
        this.moviesWatchlist.push(movieId);
      }
    } else {
      this.moviesWatchlist = this.moviesWatchlist.filter(id => id !== movieId);
    }

    // Update the mediaItems array to reflect the changes
    this.mediaItems = this.mediaItems.map(item => {
      if (item.type === 'movie' && item.id.toString() === movieId) {
        return {
          ...item,
          isFavorite: isFavorite,
          watched: item.watched // preserve the watched status
        };
      }
      return item;
    });
  }

  updateSeriesStatus(seriesId: string, isFavorite: boolean, isWatchlist: boolean): void {
    // Update the local arrays immediately
    if (isFavorite) {
      if (!this.seriesFavorites.includes(seriesId)) {
        this.seriesFavorites.push(seriesId);
      }
    } else {
      this.seriesFavorites = this.seriesFavorites.filter(id => id !== seriesId);
    }

    if (isWatchlist) {
      if (!this.seriesWatchlist.includes(seriesId)) {
        this.seriesWatchlist.push(seriesId);
      }
    } else {
      this.seriesWatchlist = this.seriesWatchlist.filter(id => id !== seriesId);
    }

    // Update the mediaItems array to reflect the changes
    this.mediaItems = this.mediaItems.map(item => {
      if (item.type === 'series' && item.id.toString() === seriesId) {
        return {
          ...item,
          isFavorite: isFavorite,
          watched: item.watched // preserve the watched status
        };
      }
      return item;
    });
  }

}