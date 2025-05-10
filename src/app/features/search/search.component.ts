import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MovieCardComponent } from "../../shared/components/movie-card/movie-card.component";
import { CommonModule } from '@angular/common';
import { config } from '../../../../assets/app.json';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { SeriesCardComponent } from "../../shared/components/series-card/series-card.component";
@Component({
  selector: 'app-search',
  imports: [MovieCardComponent, CommonModule, SeriesCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  query: string = '';
  private imageBaseUrl = 'https://image.tmdb.org/t/p/';
  paginationInfo : any  ;

  constructor(private http : HttpClient, private router: Router,private route: ActivatedRoute) {
    this.query = (route.snapshot.queryParamMap.get('query') || '').trim();
    console.log(this.query);
    if(this.query === '') {
      this.router.navigate(['/error']);
    }
  }
  filteredSearch: any[] = [];

  ngOnInit(): void {
    forkJoin({
      movies: this.http.get(`${config.apiBaseUrl}/search/movie?query=${this.query}&api_key=${config.key}`)
        .pipe(
          map((response: any) => ({
            data: response.results,
            page: response.page,
            total_pages: response.total_pages
          }))
        ),
      tvShows: this.http.get(`${config.apiBaseUrl}/search/tv?query=${this.query}&api_key=${config.key}`)
        .pipe(
          map((response: any) => ({
            data: response.results,
            page: response.page,
            total_pages: response.total_pages
          }))
        )
    }).pipe(
      switchMap(({ movies, tvShows }) => {
        const movieDetailsRequests = movies.data.map((movie: any) =>
          this.http.get(`${config.apiBaseUrl}/movie/${movie.id}?api_key=${config.key}`).pipe(
            map((movieDetails: any) => ({
              ...movie,
              runtime: movieDetails.runtime
            }))
          )
        );

        const tvShowDetailsRequests = tvShows.data.map((tv: any) =>
          this.http.get(`${config.apiBaseUrl}/tv/${tv.id}?api_key=${config.key}`).pipe(
            map((tvShowDetails: any) => ({
              ...tv,
              seasons: tvShowDetails.seasons
            }))
          )
        );

        return forkJoin([...movieDetailsRequests, ...tvShowDetailsRequests]).pipe(
          map((results) => {
            const movieResults = results.slice(0, movies.data.length);
            const tvShowResults = results.slice(movies.data.length);
            return {
              movieResults,
              tvShowResults,
              moviesPage: movies.page,
              tvShowsPage: tvShows.page,
              moviesTotalPages: movies.total_pages,
              tvShowsTotalPages: tvShows.total_pages
            };
          })
        );
      }),
      map(({ movieResults, tvShowResults, moviesPage, tvShowsPage, moviesTotalPages, tvShowsTotalPages }) => {
        // Transform both movies and TV shows
        const transformedMovies = movieResults.map((movie: any) => this.transformMovieData(movie));
        const transformedTVShows = tvShowResults.map((tv: any) => this.transformTvShowData(tv));

        // Interleave movies and TV shows
        const mixedResults: any[] = [];
        const maxLength = Math.max(transformedMovies.length, transformedTVShows.length);

        for (let i = 0; i < maxLength; i++) {
          if (i < transformedMovies.length) mixedResults.push(transformedMovies[i]);
          if (i < transformedTVShows.length) mixedResults.push(transformedTVShows[i]);
        }

        return {
          transformedResults: mixedResults,
          moviesPage,
          tvShowsPage,
          moviesTotalPages,
          tvShowsTotalPages
        };
      })
    ).subscribe(({ transformedResults, moviesPage, tvShowsPage, moviesTotalPages, tvShowsTotalPages }) => {
      // Handle the mixed and transformed results
      this.filteredSearch = transformedResults;

      // Optionally, store pagination info
      this.paginationInfo = {
        moviesPage,
        tvShowsPage,
        moviesTotalPages,
        tvShowsTotalPages
      };
    });
  }






  private transformMovieData(movie: any) {
    return {
      id: movie.id,
      title: movie.title || movie.name || "Unknown Title",
        imageUrl: this.getImageUrl(movie.poster_path, 'w342'),
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
        imageUrl: `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`, // Poster image URL
        rating: tvShow.vote_average, // Rating (average score)
        ratingCount: tvShow.vote_count, // Total number of votes
        seasons: tvShow.seasons.length, // Number of seasons
        episodes: tvShow.seasons.reduce((total: number, season: any) => total + (season.episode_count || 0), 0), // Total number of episodes
        description: tvShow.overview || 'No description available', // Description of the TV Show
        hasSub: true, // Placeholder for subtitles availability
        hasDub: true, // Placeholder for dubbing availability
        type: 'tv' // Type of content (movie or TV show)
      };
    }

}
