import { SeriesCardComponent } from '../../shared/components/series-card/series-card.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeriesService } from '../../services/series.service';
import { Series, SeriesCast } from '../../shared/models/series.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin, of, catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserListsService, UserReview } from '../../features/profile/services/user-lists.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/Service/authService';

@Component({
  selector: 'app-series-preview',
  standalone: true,
  imports: [CommonModule, SeriesCardComponent, FormsModule],
  templateUrl: './series-preview.component.html',
  styleUrls: ['./series-preview.component.scss']
})
export class SeriesPreviewComponent implements OnInit {
  series: Series | null = null;
  similarSeries: Series[] = [];
  seriesCast: SeriesCast[] = [];
  seasonEpisodeCounts: { [key: number]: number } = {};

  loading = true;
  error: string | null = null;
  activeTab = 'similar';
  isFavorite = false;
  isWatchlist = false;
  seriesID: string | null = null;
  hasWatchableVideo: boolean = false;

  // Review-related properties
  userRating: number = 0;
  userReviewComment: string = '';
  userHasReview: boolean = false;
  userReview: UserReview | null = null;
  reviewSubmitting: boolean = false;

  trailerUrl: string | null = null;
  safeTrailerUrl: SafeResourceUrl | null = null;
  showTrailer = false;

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService,
    private sanitizer: DomSanitizer,
    private listServices: UserListsService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.seriesID = id;
        this.loadSeriesData();
        // Only check favorite/watchlist status if user is authenticated
        if (this.authService.isAuthenticated()) {
          this.checkFavoriteStatus(id);
          this.checkWatchlistStatus(id);
          this.checkUserReview();
        }
      } else {
        this.error = 'Series ID not found';
        this.loading = false;
      }
    });
  }

  loadSeriesData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      series: this.seriesService.getSeriesById(this.seriesID!),
      similar: this.seriesService.getSimilarSeries(this.seriesID!).pipe(catchError(() => of([]))),
      cast: this.seriesService.getSeriesCast(this.seriesID!).pipe(catchError(() => of([]))),
      trailer: this.seriesService.getSeriesTrailers(this.seriesID!).pipe(catchError(() => of(null)))
    }).subscribe({
      next: (data) => {
        this.series = data.series;
        this.similarSeries = data.similar;
        this.seriesCast = data.cast;

        // Trailer
        this.trailerUrl = data.trailer;
        this.hasWatchableVideo = !!data.trailer;
        if (this.trailerUrl) {
          this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${this.trailerUrl}`
          );
        }

        // Load season episode counts
        if (this.series && this.series.seasons! > 0) {
          this.seriesService.getAllSeasonEpisodeCounts(this.seriesID!, this.series.seasons!)
            .subscribe(counts => {
              this.seasonEpisodeCounts = counts;
            });
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading series data:', err);
        this.error = 'Failed to load series data. Please try again.';
        this.loading = false;
      }
    });
  }

  // Format a date to a more readable format
  formatDate(dateString: string): string {
    if (!dateString) return 'Unknown';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Get year from date string
  getYear(dateString: string): number | null {
    if (!dateString) return null;
    return new Date(dateString).getFullYear();
  }

  // Get an array of numbers from 1 to n
  getNumberArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

  // Get episode count for a specific season
  getSeasonEpisodeCount(seasonNumber: number): number {
    return this.seasonEpisodeCounts[seasonNumber] || 0;
  }

  // Format cast members for display
  formatCast(cast: SeriesCast[]): string {
    if (!cast || cast.length === 0) return 'No cast information';
    return cast.map(actor => actor.name).join(', ');
  }

  retry(): void {
    const seriesId = this.series?.id.toString() || this.route.snapshot.paramMap.get('id');
    if (seriesId) {
      this.loadSeriesData();
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

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

  // Check watchlist status
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

  ToggleSeriesToWatchlist(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isWatchlist) {
      this.listServices.removeSeriesFromWatchlist(this.seriesID!).subscribe({
        next: () => {
          this.isWatchlist = false;
        },
        error: (err) => {
          console.error('Error removing from watchlist:', err);
        }
      });
    } else {
      this.listServices.addSeriesToWatchlist(this.seriesID!).subscribe({
        next: () => {
          this.isWatchlist = true;
        },
        error: (err) => {
          console.error('Error adding to watchlist:', err);
        }
      });
    }
  }

  toggleFavorite(seriesId: string): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isFavorite) {
      this.listServices.removeSeriesFromFavorites(seriesId).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (err) => {
          console.error('Error removing from favorites:', err);
        }
      });
    } else {
      this.listServices.addSeriesToFavorites(seriesId).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (err) => {
          console.error('Error adding to favorites:', err);
        }
      });
    }
  }

  navigateToWatch(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.seriesID) return;

    this.listServices.addSeriesToTracking(this.seriesID).subscribe({
      next: () => {
        this.router.navigate(['/watch'], { queryParams: { watchid: this.seriesID, type: 'tv' } });
      },
      error: (err) => {
        console.error('Error marking as watched:', err);
        this.router.navigate(['/watch'], { queryParams: { watchid: this.seriesID, type: 'tv' } });
      }
    });
  }

  // Check if user has already reviewed this series
  checkUserReview(): void {
    this.listServices.getUserSeriesReview(this.seriesID!).subscribe({
      next: (review) => {
        if (review) {
          this.userHasReview = true;
          this.userReview = review;
          this.userRating = review.rating;
          this.userReviewComment = review.comment;
        } else {
          this.userHasReview = false;
          this.userReview = null;
          this.userRating = 0;
          this.userReviewComment = '';
        }
      },
      error: (err) => {
        console.error('Error checking user review:', err);
      }
    });
  }

  // Set user rating when clicking on stars
  setUserRating(rating: number): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.userRating = rating;
  }

  // Submit or update a review for the series
  submitReview(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.series || !this.userRating) return;

    this.reviewSubmitting = true;
    const seriesId = this.series.id.toString();
    const review = {
      rating: this.userRating,
      comment: this.userReviewComment
    };

    // Choose whether to update or add a new review
    const observable = this.userHasReview
      ? this.listServices.updateSeriesReview(seriesId, review)
      : this.listServices.addSeriesReview(seriesId, review);

    observable.subscribe({
      next: () => {
        // After submitting, refresh the user's review data
        this.checkUserReview();
        this.reviewSubmitting = false;

        // Optionally reload the series to see the updated reviews
        this.loadSeriesData();
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        this.reviewSubmitting = false;
      }
    });
  }

  // Delete the user's review
  deleteReview(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.series || !this.userHasReview) return;

    this.reviewSubmitting = true;
    const seriesId = this.series.id.toString();

    this.listServices.removeSeriesReview(seriesId).subscribe({
      next: () => {
        this.userHasReview = false;
        this.userReview = null;
        this.userRating = 0;
        this.userReviewComment = '';
        this.reviewSubmitting = false;

        // Optionally reload the series to see the updated reviews
        this.loadSeriesData();
      },
      error: (err) => {
        console.error('Error deleting review:', err);
        this.reviewSubmitting = false;
      }
    });
  }

  // Scroll to review form when edit button is clicked
  editReview(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.switchTab('reviews');

    // Make sure we're in the reviews tab before scrolling
    setTimeout(() => {
      const reviewForm = document.getElementById('review-form');
      if (reviewForm) {
        reviewForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // Helper method to generate an array for star display
  getStarsArray(count: number): any[] {
    return new Array(count);
  }

  // Format the date for user reviews
  formatUserReviewDate(dateInput: any): string {
    if (!dateInput) return '';

    // Handle both string dates and Firestore timestamps
    let date;
    if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else if (dateInput.toDate && typeof dateInput.toDate === 'function') {
      // Handle Firestore timestamp
      date = dateInput.toDate();
    } else if (dateInput.seconds) {
      // Handle Firestore timestamp in seconds format
      date = new Date(dateInput.seconds * 1000);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      return 'Invalid date';
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
