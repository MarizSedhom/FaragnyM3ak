import { Component, QueryList, ViewChildren, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDragPlaceholder, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { SeriesCardComponent } from '../../shared/components/series-card/series-card.component';
import { UserListsService } from './services/user-lists.service';
import { Movie } from '../../shared/models/movie.model';
import { Series } from '../../shared/models/series.model';
import { UserLists } from './models/user-lists.model';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SeriesCardComponent, DragDropModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  // Type guard functions
  isMovie(item: Movie | Series): item is Movie {
    return 'duration' in item;
  }

  isSeries(item: Movie | Series): item is Series {
    return 'seasons' in item;
  }

  // Pagination for each section
  currentContinueIndex: number = 0;
  currentWatchlistIndex: number = 0;
  currentFavoritesIndex: number = 0;
  
  // Number of items to display per page
  readonly itemsPerPage: number = 4;
  readonly scrollAmount: number = 300;
  
  // User lists
  userLists: UserLists = {
    movies: {
      favorites: [],
      watchlist: [],
      tracking: [],
      reviews: []
    },
    series: {
      favorites: [],
      watchlist: [],
      tracking: [],
      reviews: []
    }
  };

  constructor(
    private userListsService: UserListsService,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {}
  
  ngOnInit() {
    // Listen for auth state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, load their lists
        this.loadUserLists();
      } else {
        // User is not signed in, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }

  private async loadUserLists() {
    try {
      // Get user lists from UserListsService
      this.userListsService.getUserLists().subscribe(async lists => {
        // Fetch full movie data for each list
        const movieIds = [
          ...lists.movies.favorites,
          ...lists.movies.watchlist,
          ...lists.movies.tracking
        ];
        
        const seriesIds = [
          ...lists.series.favorites,
          ...lists.series.watchlist,
          ...lists.series.tracking
        ];
        
        // Fetch movies
        const moviesQuery = query(
          collection(this.firestore, 'movies'),
          where('id', 'in', movieIds)
        );
        const moviesSnapshot = await getDocs(moviesQuery);
        const movies = moviesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: Number(data['id']), // Convert string ID to number
            duration: Number(data['duration']), // Ensure duration is a number
            rating: Number(data['rating']), // Ensure rating is a number
            ratingCount: Number(data['ratingCount']) // Ensure ratingCount is a number
          } as Movie;
        });

        // Fetch series
        const seriesQuery = query(
          collection(this.firestore, 'series'),
          where('id', 'in', seriesIds)
        );
        const seriesSnapshot = await getDocs(seriesQuery);
        const series = seriesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: Number(data['id']), // Convert string ID to number
            rating: Number(data['rating']), // Ensure rating is a number
            ratingCount: Number(data['ratingCount']), // Ensure ratingCount is a number
            seasons: Number(data['seasons']), // Ensure seasons is a number
            episodes: Number(data['episodes']) // Ensure episodes is a number
          } as Series;
        });

        // Update user lists with full data
        this.userLists = {
          movies: {
            favorites: movies.filter(movie => lists.movies.favorites.includes(movie.id.toString())),
            watchlist: movies.filter(movie => lists.movies.watchlist.includes(movie.id.toString())),
            tracking: movies.filter(movie => lists.movies.tracking.includes(movie.id.toString())),
            reviews: lists.movies.reviews
          },
          series: {
            favorites: series.filter(s => lists.series.favorites.includes(s.id.toString())),
            watchlist: series.filter(s => lists.series.watchlist.includes(s.id.toString())),
            tracking: series.filter(s => lists.series.tracking.includes(s.id.toString())),
            reviews: lists.series.reviews
          }
        };

        console.log('Loaded user lists:', this.userLists); // Debug log
      });
    } catch (error) {
      console.error('Error loading user lists:', error);
    }
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

  // Pagination controls for Watchlist
  prevWatchlist() {
    if (this.currentWatchlistIndex > 0) {
      this.currentWatchlistIndex--;
      this.scrollSection('watchlist', -1);
    }
  }

  nextWatchlist() {
    const maxItems = this.watchList.length;
    const maxPages = Math.ceil(maxItems / this.itemsPerPage);
    
    if (this.currentWatchlistIndex < maxPages - 1) {
      this.currentWatchlistIndex++;
      this.scrollSection('watchlist', 1);
    }
  }

  // Pagination controls for Favorites
  prevFavorites() {
    if (this.currentFavoritesIndex > 0) {
      this.currentFavoritesIndex--;
      this.scrollSection('favorites', -1);
    }
  }

  nextFavorites() {
    const maxItems = this.favorites.length;
    const maxPages = Math.ceil(maxItems / this.itemsPerPage);
    
    if (this.currentFavoritesIndex < maxPages - 1) {
      this.currentFavoritesIndex++;
      this.scrollSection('favorites', 1);
    }
  }

  // filtering tabs
  filters = [
    { label: 'All', value: 'all'},
    { label: 'Watched', value: 'watched'},
    { label: 'Unwatched', value: 'unwatched' },
    { label: 'In Progress', value: 'in-progress'}
  ];
  selectedFilter = 'all';

  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  get watchList(): (Movie | Series)[] {
    return [
      ...this.userLists.movies.watchlist,
      ...this.userLists.series.watchlist
    ];
  }

  get favorites(): (Movie | Series)[] {
    return [
      ...this.userLists.movies.favorites,
      ...this.userLists.series.favorites
    ];
  }
  
  get continueWatching(): (Movie | Series)[] {
    return [
      ...this.userLists.movies.tracking,
      ...this.userLists.series.tracking
    ];
  }

  // Scrolling Section
  @ViewChild('continueScroll') continueScroll!: ElementRef;
  @ViewChild('watchlistScroll') watchlistScroll!: ElementRef;
  @ViewChild('favoritesScroll') favoritesScroll!: ElementRef;

  scrollSection(section: 'continue' | 'watchlist' | 'favorites', direction: number) {
    const container = this.getScrollContainer(section);
    if (!container) return;

    const scrollAmount = this.scrollAmount * direction;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  private getScrollContainer(section: string): HTMLElement | null {
    return {
      'continue': this.continueScroll?.nativeElement,
      'watchlist': this.watchlistScroll?.nativeElement,
      'favorites': this.favoritesScroll?.nativeElement,
    }[section] || null;
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
}