import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService, MovieDetail, RelatedMovie } from '../../services/movie.service';
import { HttpClientModule } from '@angular/common/http';
import { switchMap, of, catchError } from 'rxjs';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { Movie } from '../../shared/models/movie.model';
import { UserListsService } from '../profile/services/user-lists.service';

@Component({
  selector: 'app-movie-preview',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MovieCardComponent],
  templateUrl: './movie-preview.component.html',
  styleUrl: './movie-preview.component.scss'
})
export class MoviePreviewComponent implements OnInit {
  ToggleMovieToWatchlist() {
    this.isWatchlist = !this.isWatchlist;
    if(this.isWatchlist){
      this.listServices.addMovieToWatchlist(this.movie!.id.toString())
    }
    else{
      this.listServices.removeMovieFromWatchlist(this.movie!.id.toString())
    }
  }
  movieId: number | null = null;
  movie: MovieDetail | null = null;
  relatedMovies: RelatedMovie[] = [];
  activeTab: string = 'related';
  userRating: number = 0;
  isFavorite: boolean = false;
  isWatchlist: boolean = false;
  loading: boolean = true;
  error: string | null = null;

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
      imageUrl: relatedMovie.imageUrl || 'https://via.placeholder.com/150',
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

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) {
      this.listServices.addMovieToFavorites(this.movie!.id.toString())
    }
    else {
      this.listServices.removeMovieFromFavorites(this.movie!.id.toString())
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
}
