import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService, MovieDetail, RelatedMovie, MovieCast } from '../../services/movie.service';
import { switchMap, of, catchError } from 'rxjs';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { Movie } from '../../shared/models/movie.model';
import { UserListsService, UserReview } from '../profile/services/user-lists.service';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/Service/authService';


@Component({
  selector: 'app-movie-preview',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, FormsModule],
  templateUrl: './movie-preview.component.html',
  styleUrl: './movie-preview.component.scss'
})
export class MoviePreviewComponent implements OnInit {

  movieId: number | null = null;
  movie: MovieDetail | null = null;
  relatedMovies: RelatedMovie[] = [];
  relatedMoviesWithDetails: Movie[] = []; // New property to store related movies with duration
  movieCast: MovieCast[] = [];
  activeTab: string = 'related';
  userRating: number = 0;
  userReviewComment: string = '';
  userHasReview: boolean = false;
  userReview: UserReview | null = null;
  isFavorite: boolean = false;
  isWatchlist: boolean = false;
  loading: boolean = true;
  error: string | null = null;
  movieVideos: any = null;
  hasWatchableVideo: boolean = false;
  mainVideoKey: string | null = null;
  reviewSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private listServices: UserListsService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.movieId = parseInt(id, 10);
        this.loadMovieData();
        // Only check favorite/watchlist status if user is authenticated
        if (this.authService.isAuthenticated()) {
          this.checkFavoriteStatus(this.movieId.toString());
          this.checkWatchlistStatus(this.movieId.toString());
          this.checkUserReview();
        }
        this.loadMovieVideos();
        this.loadMovieCast();
      }
    });
  }

  loadMovieData(): void {
    if (!this.movieId) return;

    this.loading = true;
    this.error = null;

    this.movieService.getMovieById(this.movieId).pipe(
      switchMap(movie => {
        this.movie = movie;

        if (movie.related && movie.related.length > 0) {
          return this.movieService.getRelatedMovies(this.movieId!);
        }
        return of([]);
      }),
      switchMap(relatedMovies => {
        this.relatedMovies = relatedMovies;

        // Convert related movies to the Movie format (but without duration yet)
        const basicRelatedMovies = relatedMovies.map(relatedMovie => this.convertToBasicMovieFormat(relatedMovie));

        // Now fetch details for these movies to get their durations
        return this.movieService.getDetailsForMovies(basicRelatedMovies);
      }),
      catchError(error => {
        this.error = 'Failed to load movie data. Please try again later.';
        console.error('Error loading movie data:', error);
        return of([]);
      })
    ).subscribe({
      next: (moviesWithDetails) => {
        this.relatedMoviesWithDetails = moviesWithDetails;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // New method to load movie cast data
  loadMovieCast(): void {
    if (!this.movieId) return;

    this.movieService.getMovieCast(this.movieId).pipe(
      catchError(error => {
        console.error('Error loading movie cast:', error);
        return of([]);
      })
    ).subscribe(cast => {
      this.movieCast = cast;
    });
  }

  // Format cast members for display (similar to series component)
  formatCast(cast: MovieCast[]): string {
    if (!cast || cast.length === 0) return 'No cast information';
    return cast.map(actor => actor.name).join(', ');
  }

  // Convert RelatedMovie to basic Movie format (without duration)
  convertToBasicMovieFormat(relatedMovie: RelatedMovie): Movie {
    return {
      id: relatedMovie.id,
      title: relatedMovie.title,
      imageUrl: relatedMovie.imageUrl || environment.ThemovieDB.nullImageUrl,
      rating: 0,
      ratingCount: 0,
      duration: 0, // This will be filled in by getDetailsForMovies
      description: `${relatedMovie.matchPercentage}% Match to ${this.movie?.title}`,
      hasSub: true,
      hasDub: false
    };
  }

  // Add the missing method used in the template
  convertToMovieFormat(relatedMovie: RelatedMovie): Movie {
    // Find the corresponding movie with details including duration
    const movieWithDetails = this.relatedMoviesWithDetails.find(m => m.id === relatedMovie.id);
    if (movieWithDetails) {
      return {
        ...movieWithDetails,
        description: `${relatedMovie.matchPercentage}% Match to ${this.movie?.title}`
      };
    }
    // Fallback to basic format if details aren't available yet
    return this.convertToBasicMovieFormat(relatedMovie);
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }

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

  // New method to check if user has already reviewed this movie
  checkUserReview(): void {
    if (!this.movieId) return;

    this.listServices.getUserMovieReview(this.movieId.toString()).subscribe({
      next: (review) => {
        if (review) {
          this.userHasReview = true;
          this.userReview = review;
          this.userRating = review.rating;
          this.userReviewComment = review.comment;
        } else {
          this.userHasReview = false;
          this.userReview = null;
        }
      },
      error: (err) => {
        console.error('Error checking user review:', err);
      }
    });
  }

  ToggleMovieToWatchlist(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isWatchlist) {
      this.listServices.removeMovieFromWatchlist(this.movieId!.toString()).subscribe({
        next: () => {
          this.isWatchlist = false;
        },
        error: (err) => {
          console.error('Error removing from watchlist:', err);
        }
      });
    } else {
      this.listServices.addMovieToWatchlist(this.movieId!.toString()).subscribe({
        next: () => {
          this.isWatchlist = true;
        },
        error: (err) => {
          console.error('Error adding to watchlist:', err);
        }
      });
    }
  }

  toggleFavorite(movieId: string): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isFavorite) {
      this.listServices.removeMovieFromFavorites(movieId).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (err) => {
          console.error('Error removing from favorites:', err);
        }
      });
    } else {
      this.listServices.addMovieToFavorites(movieId).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (err) => {
          console.error('Error adding to favorites:', err);
        }
      });
    }
  }

  setUserRating(rating: number): void {
    this.userRating = rating;
  }

  // Scroll to review form when edit button is clicked
  editReview(): void {
    this.switchTab('reviews');

    // Make sure we're in the reviews tab before scrolling
    setTimeout(() => {
      const reviewForm = document.getElementById('review-form');
      if (reviewForm) {
        reviewForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // Modified to submit the user's review
  submitReview(): void {
    if (!this.movieId || !this.userRating) return;

    this.reviewSubmitting = true;

    const review = {
      rating: this.userRating,
      comment: this.userReviewComment
    };

    // Choose whether to update or add a new review
    const observable = this.userHasReview
      ? this.listServices.updateMovieReview(this.movieId.toString(), review)
      : this.listServices.addMovieReview(this.movieId.toString(), review);

    observable.subscribe({
      next: () => {
        // After submitting, refresh the user's review data
        this.checkUserReview();
        this.reviewSubmitting = false;

        // Optionally reload the movie to see the updated reviews
        this.loadMovieData();
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        this.reviewSubmitting = false;
      }
    });
  }

  // Delete the user's review
  deleteReview(): void {
    if (!this.movieId || !this.userHasReview) return;

    this.reviewSubmitting = true;

    this.listServices.removeMovieReview(this.movieId.toString()).subscribe({
      next: () => {
        this.userHasReview = false;
        this.userReview = null;
        this.userRating = 0;
        this.userReviewComment = '';
        this.reviewSubmitting = false;

        // Optionally reload the movie to see the updated reviews
        this.loadMovieData();
      },
      error: (err) => {
        console.error('Error deleting review:', err);
        this.reviewSubmitting = false;
      }
    });
  }

  getStarsArray(count: number): any[] {
    return new Array(count);
  }

  getYear(dateString: string | undefined): string {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Fixed formatting for user reviews date
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

  formatReviewDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDuration(minutes: number): string {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  retry(): void {
    this.loadMovieData();
  }

  loadMovieVideos(): void {
    if (!this.movieId) return;
    this.movieService.getMovieVideos(this.movieId).subscribe({
      next: (videos) => {
        this.movieVideos = videos;
        // Find a main video (prefer Trailer, then Featurette, etc.)
        const trailer = videos.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
        const featurette = videos.results?.find((v: any) => v.type === 'Featurette' && v.site === 'YouTube');
        const mainVideo = trailer || featurette || videos.results?.find((v: any) => v.site === 'YouTube');
        this.mainVideoKey = mainVideo ? mainVideo.key : null;
        this.hasWatchableVideo = !!this.mainVideoKey;
      },
      error: (err) => {
        this.movieVideos = null;
        this.hasWatchableVideo = false;
        this.mainVideoKey = null;
        console.error('Error loading movie videos:', err);
      }
    });
  }

  navigateToWatch(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.movieId) return;

    this.listServices.addMovieToTracking(this.movieId.toString()).subscribe({
      next: () => {
        this.router.navigate(['/watch'], { queryParams: { watchid: this.movieId, type: 'movie' } });

      },
      error: (err) => {
        console.error('Error marking as watched:', err);
        this.router.navigate(['/watch'], { queryParams: { watchid: this.movieId, type: 'movie' } });
      }
    });
  }
}
