import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError, forkJoin, switchMap } from 'rxjs';
import { Series, SeriesCast, SeriesResponse } from '../shared/models/series.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private apiBaseUrl = environment.ThemovieDB.apiBaseUrl;
  private apiKey = environment.ThemovieDB.apiKey;
  private imageBaseUrl = environment.ThemovieDB.imageBaseUrl;

  private genreMap: { [id: number]: string } = {};

  constructor(private http: HttpClient) { }

  // Get series by ID - needed for the SeriesPreviewComponent
  getSeriesById(id: string): Observable<Series> {
    return this.http.get(`${this.apiBaseUrl}/tv/${id}?api_key=${this.apiKey}&append_to_response=created_by,networks,reviews`)
      .pipe(
        map((response: any) => {
          return this.transformSeriesDetails(response);
        }),
        catchError(error => {
          console.error(`Error fetching series with ID ${id}:`, error);
          throw error;
        })
      );
  }

  getTopRatedSeries(): Observable<Series[]> {
    return this.http.get(`${this.apiBaseUrl}/tv/top_rated?api_key=${this.apiKey}&language=en-US&page=1`)
      .pipe(
        map((response: any) => {
          return response.results.slice(0, 10);
        }),
        switchMap((series: any[]) => {
          // Fetch full details for each series to get seasons and episodes count
          const detailRequests = series.map((s: any) =>
            this.getSeriesById(s.id.toString()).pipe(
              catchError(() => of(this.transformSeriesData(s)))
            )
          );
          return forkJoin(detailRequests);
        }),
        catchError(error => {
          console.error('Error fetching top rated series:', error);
          throw error;
        })
      );
  }

  // Get popular series with full details
  getPopularSeries(): Observable<Series[]> {
    return this.http.get(`${this.apiBaseUrl}/tv/popular?api_key=${this.apiKey}`)
      .pipe(
        map((response: any) => {
          return response.results;
        }),
        switchMap((series: any[]) => {
          // Fetch full details for each series to get seasons and episodes count
          const detailRequests = series.map((s: any) =>
            this.getSeriesById(s.id.toString()).pipe(
              catchError(() => of(this.transformSeriesData(s)))
            )
          );
          return forkJoin(detailRequests);
        }),
        catchError(error => {
          console.error('Error fetching popular series:', error);
          throw error;
        })
      );
  }

  // Get similar series with full details
  getSimilarSeries(id: string): Observable<Series[]> {
    return this.http.get(`${this.apiBaseUrl}/tv/${id}/similar?api_key=${this.apiKey}`)
      .pipe(
        map((response: any) => {
          return response.results.slice(0, 6);
        }),
        switchMap((series: any[]) => {
          if (series.length === 0) {
            return of([]);
          }
          // Fetch full details for each similar series
          const detailRequests = series.map((s: any) =>
            this.getSeriesById(s.id.toString()).pipe(
              catchError(() => of(this.transformSeriesData(s)))
            )
          );
          return forkJoin(detailRequests);
        }),
        catchError(error => {
          console.error(`Error fetching similar series for ID ${id}:`, error);
          return of([]);
        })
      );
  }

  // Get series cast members
  getSeriesCast(id: string): Observable<SeriesCast[]> {
    return this.http.get(`${this.apiBaseUrl}/tv/${id}/credits?api_key=${this.apiKey}`)
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
          console.error(`Error fetching cast for series ID ${id}:`, error);
          return of([]);
        })
      );
  }

  // Get series reviews
  getSeriesReviews(id: string): Observable<any[]> {
    return this.http.get(`${this.apiBaseUrl}/tv/${id}/reviews?api_key=${this.apiKey}`)
      .pipe(
        map((response: any) => {
          return response.results.map((review: any) => ({
            user: review.author,
            stars: Math.round(review.author_details.rating / 2), // Convert from 10-point to 5-point scale
            comment: review.content,
            date: new Date(review.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          }));
        }),
        catchError(error => {
          console.error(`Error fetching reviews for series ID ${id}:`, error);
          return of([]);
        })
      );
  }

  // Get series trailers
  getSeriesTrailers(id: string): Observable<string | null> {
    return this.http.get(`${this.apiBaseUrl}/tv/${id}/videos?api_key=${this.apiKey}`)
      .pipe(
        map((response: any) => {
          const trailers = response.results.filter(
            (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
          );
          return trailers.length > 0 ? trailers[0].key : null;
        }),
        catchError(error => {
          console.error(`Error fetching trailers for series ID ${id}:`, error);
          return of(null);
        })
      );
  }


  // Get all seasons' episode counts
  getAllSeasonEpisodeCounts(seriesId: string, numberOfSeasons: number): Observable<{ [key: number]: number }> {
    if (numberOfSeasons <= 0) {
      return of({});
    }

    // Create an array of observables for each season
    const seasonObservables = Array.from({ length: numberOfSeasons }, (_, i) => i + 1)
      .map(seasonNum => this.getSeasonDetails(seriesId, seasonNum)
        .pipe(
          map(season => ({ [seasonNum]: season.episodeCount })),
          catchError(() => of({ [seasonNum]: 0 }))
        )
      );

    // Combine all observables and merge results
    return forkJoin(seasonObservables).pipe(
      map(results => {
        const episodeCounts: { [key: number]: number } = {};
        results.forEach(result => {
          Object.assign(episodeCounts, result);
        });
        return episodeCounts;
      }),
      catchError(() => of({}))
    );
  }
  //--------------------------------- Admin Series ----------------------------------------------
  AdmingetAiringTodaySeries(): Observable<{ totalResults: number, series: Series[] }> {
    return this.http.get(`${this.apiBaseUrl}/tv/airing_today?api_key=${this.apiKey}&language=en-US&page=1`)
      .pipe(
        map((response: any) => {
          const totalResults = response.total_results;
          const series = response.results.map((item: any) => this.transformSeriesData(item));
          return { totalResults, series };
        }),
        catchError(error => {
          console.error('Error fetching airing today series:', error);
          return of({ totalResults: 0, series: [] });
        })
      );
  }

  AdmingetOnTheAirSeries(): Observable<{ totalResults: number, series: Series[] }> {
    return this.http.get(`${this.apiBaseUrl}/tv/on_the_air?api_key=${this.apiKey}&language=en-US&page=1`)
      .pipe(
        map((response: any) => {
          const totalResults = response.total_results;
          const series = response.results.map((item: any) => this.transformSeriesData(item));
          return { totalResults, series };
        }),
        catchError(error => {
          console.error('Error fetching on the air series:', error);
          return of({ totalResults: 0, series: [] });
        })
      );
  }


  AdmingetPopularSeries(): Observable<{ totalResults: number, series: Series[] }> {
    return this.http.get(`${this.apiBaseUrl}/tv/popular?api_key=${this.apiKey}&language=en-US&page=1`)
      .pipe(
        map((response: any) => {
          const totalResults = response.total_results;
          const series = response.results.map((item: any) => this.transformSeriesData(item));
          return { totalResults, series };
        }),
        catchError(error => {
          console.error('Error fetching popular series:', error);
          return of({ totalResults: 0, series: [] });
        })
      );
  }

  AdmingetTopRatedSeries(): Observable<{ totalResults: number, series: Series[] }> {
    return this.http.get(`${this.apiBaseUrl}/tv/top_rated?api_key=${this.apiKey}&language=en-US&page=1`)
      .pipe(
        map((response: any) => {
          const totalResults = response.total_results;
          const series = response.results.map((item: any) => this.transformSeriesData(item));
          return { totalResults, series };
        }),
        catchError(error => {
          console.error('Error fetching top rated series:', error);
          return of({ totalResults: 0, series: [] });
        })
      );
  }

  getTVSeriesByDateRange(startDate: string, endDate: string): Observable<any[]> {
    const baseUrl = `${this.apiBaseUrl}/discover/tv?first_air_date.gte=${startDate}&first_air_date.lte=${endDate}&with_original_language=en&api_key=${this.apiKey}&page=1`;

    return this.http.get<any>(baseUrl).pipe(
      switchMap(response => {
        const totalPages = response.total_pages;
        const requests = [];

        for (let page = 1; page <= totalPages; page++) {
          const pageUrl = `${this.apiBaseUrl}/discover/tv?first_air_date.gte=${startDate}&first_air_date.lte=${endDate}&with_original_language=en&api_key=${this.apiKey}&page=${page}`;
          requests.push(this.http.get<any>(pageUrl));
        }

        return forkJoin(requests).pipe(
          map(responses => responses.flatMap(res => res.results))
        );
      })
    );
  }

  //-----------------------------------------------------------------------------
  // Get total episode count for a series
  getTotalEpisodeCount(seriesId: string, numberOfSeasons: number): Observable<number> {
    return this.getAllSeasonEpisodeCounts(seriesId, numberOfSeasons).pipe(
      map(episodeCounts => {
        return Object.values(episodeCounts).reduce((sum, count) => sum + count, 0);
      }),
      catchError(() => of(0))
    );
  }

  // Transform basic series data to match your Series interface
  private transformSeriesData(series: any): Series {
    return {
      id: series.id,
      title: series.name, // TV shows use 'name' instead of 'title' in TMDb API
      imageUrl: this.getImageUrl(series.poster_path, 'w342') || environment.ThemovieDB.nullImageUrl,
      backdropUrl: this.getImageUrl(series.backdrop_path, 'original'),
      rating: series.vote_average, // TMDb uses 10-point scale
      ratingCount: series.vote_count,
      seasons: series.number_of_seasons || 0,
      episodes: series.number_of_episodes || 0,
      description: series.overview,
      hasSub: true, // Default values since TMDb doesn't provide this info
      hasDub: false, // Default values since TMDb doesn't provide this info
      firstAirDate: series.first_air_date || null,
      lastAirDate: series.last_air_date || null,
      status: series.status || 'Unknown',
      genres: series.genres ? series.genres.map((g: any) => g.name) :
        (series.genre_ids ? this.mapGenreIdsToNames(series.genre_ids) : []),
      popularity: series.popularity || 0
    };
  }

  // Transform detailed series data
  private transformSeriesDetails(series: any): Series {
    const basicData = this.transformSeriesData(series);

    // Transform reviews if available
    const reviews = series.reviews?.results.map((review: any) => ({
      user: review.author,
      stars: Math.round(review.author_details.rating / 2), // Convert from 10-point to 5-point scale
      comment: review.content,
      date: new Date(review.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    })) || [];

    // Add additional details available only in the detailed endpoint
    return {
      ...basicData,
      creators: series.created_by ? series.created_by.map((creator: any) => creator.name) : [],
      networks: series.networks ? series.networks.map((network: any) => network.name) : [],
      reviews: reviews
    };
  }

  // Helper to get image URL
  private getImageUrl(path: string | null, size: string): string {
    if (!path) {
      return environment.ThemovieDB.nullImageUrl; // Fallback image
    }
    return `${this.imageBaseUrl}${size}${path}`;
  }

  // Map genre IDs to genre names
  private mapGenreIdsToNames(genreIds: number[]): string[] {
    const genreMap: { [id: number]: string } = {
      10759: 'Action & Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      10762: 'Kids',
      9648: 'Mystery',
      10763: 'News',
      10764: 'Reality',
      10765: 'Sci-Fi & Fantasy',
      10766: 'Soap',
      10767: 'Talk',
      10768: 'War & Politics',
      37: 'Western'
    };

    return genreIds.map(id => genreMap[id] || 'Unknown');
  }
  // Get season details including episode count
  getSeasonDetails(seriesId: string, seasonNumber: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/tv/${seriesId}/season/${seasonNumber}?api_key=${this.apiKey}`)
      .pipe(
        map((response: any) => {
          return {
            seasonNumber: response.season_number,
            episodeCount: response.episodes ? response.episodes.length : 0,
            name: response.name,
            overview: response.overview,
            airDate: response.air_date
          };
        }),
        catchError(error => {
          console.error(`Error fetching season ${seasonNumber} for series ID ${seriesId}:`, error);
          return of({
            seasonNumber: seasonNumber,
            episodeCount: 0,
            name: `Season ${seasonNumber}`,
            overview: '',
            airDate: null
          });
        })
      );
  }

  getCertainSeriesWithPagination(page: number = 1, selectedGenresString: string, category: string): Observable<SeriesResponse> {
    let apiUrl = '';

    if (selectedGenresString !== "") {
      apiUrl = `${this.apiBaseUrl}/discover/tv?api_key=${this.apiKey}&with_genres=${selectedGenresString}&page=${page}`;
    } else {
      apiUrl = `${this.apiBaseUrl}/tv/${category}?api_key=${this.apiKey}&page=${page}`;
    }

    return this.http.get(apiUrl)
      .pipe(
        // First get basic series data and transform to Series[]
        map((response: any) => ({
          results: response.results.map((series: any) => this.transformSeriesData(series)) as Series[],
          total_pages: response.total_pages,
          total_results: response.total_results,
          page: response.page
        })),
        // Then fetch full details for each series including seasons and episodes
        switchMap((response: { results: Series[]; total_pages: number; total_results: number; page: number; }) => {
          if (response.results.length === 0) {
            return of({
              results: [],
              total_pages: response.total_pages,
              total_results: response.total_results,
              page: response.page
            });
          }
    
          // Create a request for each series to get detailed information
          const detailRequests = response.results.map((series: Series) =>
            this.getSeriesById(series.id.toString()).pipe(
              catchError(() => of(series))
            )
          );
    
          return forkJoin(detailRequests).pipe(
            map(detailedSeries => ({
              results: detailedSeries,
              total_pages: response.total_pages,
              total_results: response.total_results,
              page: response.page
            }))
          );
        }),
        catchError(error => {
          console.error('Error fetching series with pagination:', error);
          throw error;
        })
      );
  }
}
