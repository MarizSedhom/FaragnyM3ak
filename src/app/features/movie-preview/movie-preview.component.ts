import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService, MovieDetail, RelatedMovie } from '../../services/movie.service';
import { HttpClientModule } from '@angular/common/http';
import { switchMap, of, catchError } from 'rxjs';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { Movie } from '../../shared/models/movie.model';
import { UserListsService } from '../profile/services/user-lists.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-movie-preview',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MovieCardComponent],
  templateUrl: './movie-preview.component.html',
  styleUrl: './movie-preview.component.scss'
})
export class MoviePreviewComponent implements OnInit {

  movieId: number | null = null;
  movie: MovieDetail | null = null;
  relatedMovies: RelatedMovie[] = [];
  activeTab: string = 'related';
  userRating: number = 0;
  isFavorite: boolean = false;
  isWatchlist: boolean = false;
  loading: boolean = true;
  error: string | null = null;
  movieVideos: any = null; // Store all videos for the movie
  hasWatchableVideo: boolean = false;
  mainVideoKey: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private listServices: UserListsService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.movieId = parseInt(id, 10);
        this.loadMovieData();
        this.checkFavoriteStatus(this.movieId.toString()); // Check if already in favorites
        this.checkWatchlistStatus(this.movieId.toString()); // Check if already in watchlist
        this.loadMovieVideos(); // Fetch all videos for the movie
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

        // If there are related movies, fetch them. Otherwise, return empty array
        if (movie.related && movie.related.length > 0) {
          return this.movieService.getRelatedMovies(this.movieId!);
        }
        return of([]);
      }),
      catchError(error => {
        this.error = 'Failed to load movie data. Please try again later.';
        console.error('Error loading movie data:', error);
        return of([]);
      })
    ).subscribe({
      next: (relatedMovies) => {
        this.relatedMovies = relatedMovies;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // Convert RelatedMovie to Movie format for movie-card component
  convertToMovieFormat(relatedMovie: RelatedMovie): Movie {
    return {
      id: relatedMovie.id,
      title: relatedMovie.title,
      imageUrl: relatedMovie.imageUrl || environment.ThemovieDB.nullImageUrl,
      rating: 0, // Default values since RelatedMovie doesn't have these properties
      ratingCount: 0,
      duration: 0,
      description: `${relatedMovie.matchPercentage}% Match to ${this.movie?.title}`,
      hasSub: true, // Default values
      hasDub: false
    };
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

  setUserRating(rating: number): void {
    this.userRating = rating;
    // Here you could add code to save the user rating
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
    if (!this.hasWatchableVideo || !this.movieId || !this.movieId) return;
    // Mark as watched
    this.listServices.addMovieToTracking(this.movieId.toString()).subscribe({
      next: () => {
        // Navigate to the watch page (assuming /watch/:watchid route)
        window.location.href = `/watch?watchid=${this.movieId}&type=movie`;
      },
      error: (err) => {
        console.error('Error marking as watched:', err);
        // Still navigate even if marking as watched fails
        window.location.href = `/watch?watchid=${this.movieId}&type=movie`;
      }
    });
  }
}
