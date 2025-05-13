import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MovieCardComponent } from "../../shared/components/movie-card/movie-card.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap, tap, finalize } from 'rxjs';
import { SeriesCardComponent } from "../../shared/components/series-card/series-card.component";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search',
  imports: [MovieCardComponent, CommonModule, SeriesCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit, AfterViewInit {

  query: string = '';
  type: string = 'movie';
  private imageBaseUrl = 'https://image.tmdb.org/t/p/';
  paginationInfo: any;
  currentPage: number = 1;
  totalPages: number = 100;
  @ViewChild("pageNum") pageNumInput!: ElementRef<HTMLInputElement>;
  @ViewChild("movieBTN") movieInput!: ElementRef<HTMLButtonElement>;
  @ViewChild("tvBTN") tvInput!: ElementRef<HTMLButtonElement>;

  // Add loading and error states
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';

  filteredSearch: any[] = [];

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.query = (route.snapshot.queryParamMap.get('query') || '').trim();
    this.type = (route.snapshot.queryParamMap.get('type') || 'movie').trim();
    this.currentPage = Number(route.snapshot.queryParamMap.get('page')) || 1;

    if (this.query === '') {
      this.router.navigate(['/error']);
    }
  }

  ngAfterViewInit() {
    if (this.type === 'tv') {
      this.tvInput.nativeElement.classList.add('activeBTN');
      this.movieInput.nativeElement.classList.remove('activeBTN');
    } else {
      this.movieInput.nativeElement.classList.add('activeBTN');
      this.tvInput.nativeElement.classList.remove('activeBTN');
    }

    this.pageNumInput?.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.currentPage = Number(this.pageNumInput?.nativeElement.value);
        if (this.currentPage < 1) {
          this.currentPage = 1;
        } else if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
        this.navigateSearch();
      }
    });
  }

  ngOnInit(): void {
    this.loadSearchResults();
  }

  loadSearchResults(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    if (this.type === 'tv') {
      this.fetchTVShows();
    } else {
      this.fetchMovies();
    }
  }

  goTo(page: string) {
    if (page === 'movie') {
      this.type = 'movie';
    }
    else if (page === 'tv') {
      this.type = 'tv';
    }
    this.navigateSearch();
  }

  navigateSearch() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/search'], { queryParams: { query: this.query, type: this.type, page: this.currentPage } });
    });
  }

  retry(): void {
    this.loadSearchResults();
  }

  // Fetch only Movies
  fetchMovies(): void {
    this.http.get(`${environment.ThemovieDB.apiBaseUrl}/search/movie?query=${this.query}&api_key=${environment.ThemovieDB.api_Key}&page=${this.currentPage}`)
      .pipe(
        map((response: any) => ({
          data: response.results,
          page: response.page,
          total_pages: response.total_pages
        })),
        switchMap((movies) => {
          if (movies.data.length === 0) {
            return of({
              transformedResults: [],
              moviesPage: movies.page,
              moviesTotalPages: movies.total_pages
            });
          }

          const movieDetailsRequests = movies.data.map((movie: any) =>
            this.http.get(`${environment.ThemovieDB.apiBaseUrl}/movie/${movie.id}?api_key=${environment.ThemovieDB.api_Key}`).pipe(
              map((movieDetails: any) => ({
                ...movie,
                runtime: movieDetails.runtime
              })),
              catchError(error => {
                console.error(`Error fetching details for movie ${movie.id}:`, error);
                // Return the movie without runtime if detail fetch fails
                return of({ ...movie, runtime: null });
              })
            )
          );

          return forkJoin(movieDetailsRequests).pipe(
            map((movieResults: any) => ({
              transformedResults: movieResults.map((movie: any) => this.transformMovieData(movie)),
              moviesPage: movies.page,
              moviesTotalPages: movies.total_pages
            }))
          );
        }),
        catchError(error => {
          console.error('Error fetching movies:', error);
          this.hasError = true;
          this.errorMessage = 'Failed to load movie search results. Please try again later.';
          return of({
            transformedResults: [],
            moviesPage: 1,
            moviesTotalPages: 0
          });
        }),
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe(({ transformedResults, moviesPage, moviesTotalPages }) => {
        this.filteredSearch = transformedResults;
        this.paginationInfo = { moviesPage, moviesTotalPages };
        this.totalPages = moviesTotalPages || 1; // Default to 1 if undefined
      });
  }

  // Fetch only TV Shows
  fetchTVShows(): void {
    this.http.get(`${environment.ThemovieDB.apiBaseUrl}/search/tv?query=${this.query}&api_key=${environment.ThemovieDB.api_Key}&page=${this.currentPage}`)
      .pipe(
        map((response: any) => ({
          data: response.results,
          page: response.page,
          total_pages: response.total_pages
        })),
        switchMap((tvShows) => {
          if (tvShows.data.length === 0) {
            return of({
              transformedResults: [],
              tvShowsPage: tvShows.page,
              tvShowsTotalPages: tvShows.total_pages
            });
          }

          const tvShowDetailsRequests = tvShows.data.map((tv: any) =>
            this.http.get(`${environment.ThemovieDB.apiBaseUrl}/tv/${tv.id}?api_key=${environment.ThemovieDB.api_Key}`).pipe(
              map((tvShowDetails: any) => ({
                ...tv,
                seasons: tvShowDetails.seasons
              })),
              catchError(error => {
                console.error(`Error fetching details for TV show ${tv.id}:`, error);
                // Return the TV show without seasons if detail fetch fails
                return of({ ...tv, seasons: [] });
              })
            )
          );

          return forkJoin(tvShowDetailsRequests).pipe(
            map((tvShowResults: any) => ({
              transformedResults: tvShowResults.map((tv: any) => this.transformTvShowData(tv)),
              tvShowsPage: tvShows.page,
              tvShowsTotalPages: tvShows.total_pages
            }))
          );
        }),
        catchError(error => {
          console.error('Error fetching TV shows:', error);
          this.hasError = true;
          this.errorMessage = 'Failed to load TV show search results. Please try again later.';
          return of({
            transformedResults: [],
            tvShowsPage: 1,
            tvShowsTotalPages: 0
          });
        }),
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe(({ transformedResults, tvShowsPage, tvShowsTotalPages }) => {
        this.filteredSearch = transformedResults;
        this.paginationInfo = { tvShowsPage, tvShowsTotalPages };
        this.totalPages = tvShowsTotalPages || 1; // Default to 1 if undefined
      });
  }

  private transformMovieData(movie: any) {
    return {
      id: movie.id,
      title: movie.title || movie.name || "Unknown Title",
      imageUrl: movie.poster_path ? this.getImageUrl(movie.poster_path, 'w342') : environment.ThemovieDB.nullImageUrl,
      rating: movie.vote_average, // TMDb uses 10-point scale
      ratingCount: movie.vote_count,
      duration: movie.runtime, // Not available in basic movie results, would need additional API call
      description: movie.overview || 'No description available', // Fallback if no overview is provided
      hasSub: true, // Default values since TMDb doesn't provide this info
      hasDub: true, // Placeholder for dubbing availability
      type: 'movie' // Type of content (movie or TV show)
    };
  }

  private getImageUrl(path: string | null, size: string): string {
    if (!path) {
      return 'assets/images/no-image.png'; // Fallback image
    }
    return `${this.imageBaseUrl}${size}${path}`;
  }

  transformTvShowData(tvShow: any) {
    return {
      id: tvShow.id, // TV Show ID
      title: tvShow.name, // TV Show title
      imageUrl: tvShow.poster_path != null ? this.getImageUrl(tvShow.poster_path, 'w342') : environment.ThemovieDB.nullImageUrl,
      rating: tvShow.vote_average, // Rating (average score)
      ratingCount: tvShow.vote_count, // Total number of votes
      seasons: tvShow.seasons ? tvShow.seasons.length : 0, // Number of seasons
      episodes: tvShow.seasons ? tvShow.seasons.reduce((total: number, season: any) => total + (season.episode_count || 0), 0) : 0, // Total number of episodes
      description: tvShow.overview || 'No description available', // Description of the TV Show
      hasSub: true, // Placeholder for subtitles availability
      hasDub: true, // Placeholder for dubbing availability
      type: 'tv' // Type of content (movie or TV show)
    };
  }
}
