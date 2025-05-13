import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError, forkJoin, switchMap  } from 'rxjs';
import { Movie, MovieDetail, MovieResponse, RelatedMovie, MovieCast } from '../shared/models/movie.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiBaseUrl = environment.ThemovieDB.apiBaseUrl;
  private imageBaseUrl = environment.ThemovieDB.imageBaseUrl;
  private apiKey = environment.ThemovieDB.api_Key;

  constructor(private http: HttpClient) { }

  // Get movie details by ID
  getMovieById(id: number | string): Observable<MovieDetail> {
    return this.http.get(`${this.apiBaseUrl}/movie/${id}?api_key=${this.apiKey}&append_to_response=credits,reviews,similar`)
      .pipe(
        map((response: any) => this.transformMovieDetailData(response)),
        catchError(error => {
          console.error('Error fetching movie:', error);
          throw error;
        })
      );
  }

  // Get movie cast members
  getMovieCast(id: string | number): Observable<MovieCast[]> {
    return this.http.get(`${this.apiBaseUrl}/movie/${id}/credits?api_key=${this.apiKey}`)
      .pipe(
        map((response: any) => {
          return response.cast.slice(0, 12).map((actor: any) => ({
            id: actor.id,
            name: actor.name,
            character: actor.character,
            profilePath: this.getImageUrl(actor.profile_path, 'w185')
          }));
        }),
        catchError(error => {
          console.error(`Error fetching cast for movie ID ${id}:`, error);
          return of([]);
        })
      );
  }

  // ADDED: Get details for multiple movies (including durations)
  getDetailsForMovies(movies: Movie[]): Observable<Movie[]> {
    if (!movies || movies.length === 0) {
      return of([]);
    }

    // Create a batch of requests to get details for each movie
    const movieDetailRequests = movies.map(movie =>
      this.http.get(`${this.apiBaseUrl}/movie/${movie.id}?api_key=${this.apiKey}`)
        .pipe(
          map((response: any) => ({
            ...movie,
            duration: response.runtime || 0
          })),
          catchError(error => {
            console.error(`Error fetching details for movie ID ${movie.id}:`, error);
            return of(movie); // Return original movie without updates if error occurs
          })
        )
    );

    return forkJoin(movieDetailRequests);
  }

  getPopularMoviesWithPagination(page: number = 1): Observable<MovieResponse> {
    return this.http.get(`${this.apiBaseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`)
      .pipe(
        map((response: any) => ({
          results: response.results.map((movie: any) => this.transformMovieData(movie)),
          total_pages: response.total_pages,
          total_results: response.total_results,
          page: response.page
        })),
        catchError(error => {
          console.error('Error fetching popular movies:', error);
          throw error;
        })
      );
  }

  // Get popular movies
  getPopularMovies(): Observable<Movie[]> {
    return this.http.get(`${this.apiBaseUrl}/movie/popular?api_key=${this.apiKey}`)
      .pipe(
        map((response: any) => {
          return response.results.map((movie: any) => this.transformMovieData(movie));
        }),
        catchError(error => {
          console.error('Error fetching popular movies:', error);
          throw error;
        })
      );
  }

  // Get top rated movies WITH duration
  getTopRatedMovies(): Observable<Movie[]> {
    return this.http.get(`${this.apiBaseUrl}/movie/top_rated?api_key=${this.apiKey}&language=en-US&page=1`)
      .pipe(
        map((response: any) => {
          const topMovies = response.results.slice(0, 10);
          // Get movie details for each top rated movie to include duration
          const detailRequests = topMovies.map((movie: any) =>
            this.getMovieById(movie.id).pipe(
              catchError(() => of(this.transformMovieData(movie)))
            )
          );
          return detailRequests;
        }),
        switchMap((requests: Observable<MovieDetail | Movie>[]) => forkJoin(requests)),
        catchError(error => {
          console.error('Error fetching top rated movies:', error);
          throw error;
        })
      );
  }

  getCertainMoviesWithPagination(page: number = 1, selectedGenresString: string, category: string): Observable<MovieResponse> {
    if (selectedGenresString != "") {
      return this.http.get(`${this.apiBaseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${selectedGenresString}&page=${page}`)
      .pipe(
          map((response: any) => ({
            results: response.results.map((movie: any) => this.transformMovieData(movie)),
            total_pages: response.total_pages,
            total_results: response.total_results,
            page: response.page
          })),
          catchError(error => {
            console.error('Error fetching now playing movies:', error);
            throw error;
          })
        );
    }
    else
      return this.http.get(`${this.apiBaseUrl}/movie/${category}?api_key=${this.apiKey}&page=${page}}`)
        .pipe(
          map((response: any) => ({
            results: response.results.map((movie: any) => this.transformMovieData(movie)),
            total_pages: response.total_pages,
            total_results: response.total_results,
            page: response.page
          })),
          catchError(error => {
            console.error('Error fetching now playing movies:', error);
            throw error;
          })
        );
  }

  // Search movies by query
  searchMovies(query: string): Observable<Movie[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    return this.http.get(`${this.apiBaseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`)
      .pipe(
        map((response: any) => {
          return response.results.map((movie: any) => this.transformMovieData(movie));
        }),
        catchError(error => {
          console.error('Error searching movies:', error);
          throw error;
        })
      );
  }
  //------------------------ admin movies -----------------------------------
  // Get now playing movies
  getNowPlayingMovies(): Observable<{ totalResults: number, movies: Movie[] }> {
    return this.http.get(`${this.apiBaseUrl}/movie/now_playing?api_key=${this.apiKey}`)
      .pipe(
        map((response: any) => {
          const totalResults = response.total_results;
          const movies = response.results.map((movie: any) => this.transformMovieData(movie));
          return { totalResults, movies };
        }),
        catchError(error => {
          console.error('Error fetching now playing movies:', error);
          return of({ totalResults: 0, movies: [] });
        })
      );
  }

  // Get top rated movies WITH duration
  AdmingetTopRatedMovies(): Observable<{ totalResults: number, movies: Movie[] }> {
    return this.http.get(`${this.apiBaseUrl}/movie/top_rated?api_key=${this.apiKey}`)
      .pipe(
        map((response: any) => {
          const totalResults = response.total_results;
          const topMovies = response.results.slice(0, 10);

          // Create an array of observables to fetch movie details for each movie
          const detailRequests = topMovies.map((movie: any) =>
            this.getMovieById(movie.id).pipe(
              catchError(() => of(this.transformMovieData(movie)))
            )
          );

          return { totalResults, detailRequests };
        }),
        switchMap((data: { totalResults: number, detailRequests: Observable<MovieDetail | Movie>[] }) => {
          return forkJoin(data.detailRequests).pipe(
            map((movies) => ({ totalResults: data.totalResults, movies }))
          );
        }),
        catchError(error => {
          console.error('Error fetching top rated movies:', error);
          return of({ totalResults: 0, movies: [] });
        })
      );
  }

  // Get upcoming movies
  getUpcomingMovies(): Observable<{ totalResults: number, movies: Movie[] }> {
    return this.http.get(`${this.apiBaseUrl}/movie/upcoming?api_key=${this.apiKey}`)
      .pipe(
        map((response: any) => {
          const totalResults = response.total_results;
          const movies = response.results.map((movie: any) => this.transformMovieData(movie));
          return { totalResults, movies };
        }),
        catchError(error => {
          console.error('Error fetching upcoming movies:', error);
          return of({ totalResults: 0, movies: [] });
        })
      );
  }

  // Get popular movies
  getPopularMoviestotal(): Observable<{ totalResults: number, movies: Movie[] }> {
    return this.http.get(`${this.apiBaseUrl}/movie/popular?api_key=${this.apiKey}`)
      .pipe(
        map((response: any) => {
          const totalResults = response.total_results;
          const movies = response.results.map((movie: any) => this.transformMovieData(movie));
          return { totalResults, movies };
        }),
        catchError(error => {
          console.error('Error fetching popular movies:', error);
          return of({ totalResults: 0, movies: [] });
        })
      );
  }

  //Category
  getMovieGenres(): Observable<{ id: number, name: string }[]> {
    return this.http.get(`${this.apiBaseUrl}/genre/movie/list?api_key=${this.apiKey}&language=en-US`)
      .pipe(
        map((response: any) => response.genres),
        catchError(error => {
          console.error('Error fetching genres:', error);
          return of([]);
        })
      );
  }

  getGenreDistribution(): Observable<{ genre: string, count: number }[]> {
    return forkJoin({
      genres: this.getMovieGenres(),
      movies: this.getNowPlayingMovies()
    }).pipe(
      map(({ genres, movies }) => {
        const genreMap = new Map<number, string>();
        genres.forEach(g => genreMap.set(g.id, g.name));

        const genreCounts: { [key: string]: number } = {};

        movies.movies.forEach(movie => {
          const movieGenres = (movie as any).genre_ids || [];
          movieGenres.forEach((genreId: number) => {
            const name = genreMap.get(genreId);
            if (name) {
              genreCounts[name] = (genreCounts[name] || 0) + 1;
            }
          });
        });

        return Object.entries(genreCounts).map(([genre, count]) => ({ genre, count }));
      })
    );
  }

 getMoviesByDateRange(startDate: string, endDate: string): Observable<any[]> {
    const baseUrl = `${this.apiBaseUrl}/discover/movie?primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&api_key=${this.apiKey}&page=1`;

    return this.http.get<any>(baseUrl).pipe(
      switchMap(response => {
        const totalPages = response.total_pages;
        const requests = [];

        for (let page = 1; page <= totalPages; page++) {
          const pageUrl = `${this.apiBaseUrl}/discover/movie?primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&api_key=${this.apiKey}&page=${page}`;
          requests.push(this.http.get<any>(pageUrl));
        }

        return forkJoin(requests).pipe(
          map(responses => responses.flatMap(res => res.results))
        );
      })
    );
  }

  //------------------------------------------------------------

  // Get movie trailers
  getMovieTrailer(movieId: number): Observable<string | null> {
    return this.http.get(`${this.apiBaseUrl}/movie/${movieId}/videos?api_key=${this.apiKey}&language=en-US`)
      .pipe(
        map((response: any) => {
          const trailers = response.results.filter((video: any) =>
            video.type === 'Trailer' && video.site === 'YouTube');
          return trailers.length > 0 ? trailers[0].key : null;
        }),
        catchError(error => {
          console.error(`Error fetching trailer for movie ${movieId}:`, error);
          return of(null);
        })
      );
  }

  // Fetch trailers for multiple movies
  getTrailersForMovies(movies: Movie[]): Observable<Movie[]> {
    if (!movies || movies.length === 0) {
      return of([]);
    }

    const movieTrailerRequests = movies.map(movie =>
      this.getMovieTrailer(movie.id).pipe(
        map(trailerKey => ({
          ...movie,
          trailerKey: trailerKey || undefined
        }))
      )
    );

    return forkJoin(movieTrailerRequests);
  }

  // Transform basic movie data to match your Movie interface
  private transformMovieData(movie: any): Movie {
    return {
      id: movie.id,
      title: movie.title,
      imageUrl: this.getImageUrl(movie.poster_path, 'w342'),
      rating: movie.vote_average, // TMDb uses 10-point scale
      ratingCount: movie.vote_count,
      duration: movie.runtime || 0, // Not available in basic movie results, set to 0
      description: movie.overview,
      hasSub: true, // Default values since TMDb doesn't provide this info
      hasDub: false,  // Default values since TMDb doesn't provide this info
      genre_ids: movie.genre_ids || []
    };
  }

  // Transform the TMDb movie detail data to match your extended MovieDetail interface
  private transformMovieDetailData(movie: any): MovieDetail {
    // Extract director from crew
    const director = movie.credits?.crew
      ?.filter((person: any) => person.job === 'Director')
      .map((person: any) => person.name)
      .join(', ') || '';

    // Extract cast with full details
    const cast = movie.credits?.cast
      ?.slice(0, 12)
      .map((person: any) => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profilePath: this.getImageUrl(person.profile_path, 'w185')
      })) || [];

    // Transform reviews
    const reviews = movie.reviews?.results.map((review: any) => ({
      user: review.author,
      stars: Math.round(review.author_details.rating / 2), // Convert from 10-point to 5-point scale
      comment: review.content,
      date: new Date(review.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    })) || [];

    // Get related movie IDs
    const related = movie.similar?.results.slice(0, 6).map((m: any) => m.id) || [];

    // Return movie with your interface format
    return {
      id: movie.id,
      title: movie.title,
      imageUrl: this.getImageUrl(movie.poster_path, 'w500'),
      rating: movie.vote_average,
      ratingCount: movie.vote_count,
      duration: movie.runtime || 0, // Duration in minutes
      description: movie.overview,
      hasSub: true, // Assuming defaults since TMDb doesn't provide this info
      hasDub: false, // Assuming defaults since TMDb doesn't provide this info
      genre_ids: movie.genre_ids || [],

      // Additional detail fields
      backdropUrl: this.getImageUrl(movie.backdrop_path, 'original'),
      releaseDate: movie.release_date,
      genres: movie.genres.map((g: any) => g.name),
      director: director,
      cast: cast, // Now includes full cast details
      reviews: reviews,
      related: related
    };
  }

  // Get related movies data
  getRelatedMovies(movieId: number | string): Observable<RelatedMovie[]> {
    return this.http.get(`${this.apiBaseUrl}/movie/${movieId}/similar?api_key=${this.apiKey}`)
      .pipe(
        map((response: any) => {
          return response.results.slice(0, 6).map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            imageUrl: this.getImageUrl(movie.poster_path, 'w342'),
            matchPercentage: Math.floor(Math.random() * 28) + 70 // Simulated match percentage
          }));
        }),
        catchError(error => {
          console.error('Error fetching related movies:', error);
          return of([]);
        })
      );
  }

  // Get full image URL from path
  private getImageUrl(path: string | null, size: string): string {
    if (!path) {
      return environment.ThemovieDB.nullImageUrl;
    }
    return `${this.imageBaseUrl}${size}${path}`;
  }

  // Get all videos for a movie (trailers, featurettes, etc.)
  getMovieVideos(movieId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/movie/${movieId}/videos?api_key=${this.apiKey}&language=en-US`).pipe(
      map((response: any) => response),
      catchError(error => {
        console.error(`Error fetching videos for movie ${movieId}:`, error);
        return of({ id: movieId, results: [] });
      })
    );
  }
}
export type { RelatedMovie, MovieDetail, MovieCast };
