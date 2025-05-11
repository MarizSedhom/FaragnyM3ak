import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Observable, map,of, catchError } from 'rxjs';
import { Series, SeriesResponse } from '../../shared/models/series.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private apiBaseUrl = 'https://api.themoviedb.org/3';
  private apiKey = environment.ThemovieDB.apiKey;
  private imageBaseUrl = 'https://image.tmdb.org/t/p/';

  constructor(private http: HttpClient) { }
    // Get popular movies
    getPopularSeries(): Observable<Series[]> {
      return this.http.get(`${this.apiBaseUrl}/tv/popular?api_key=${this.apiKey}`)
        .pipe(
          map((response: any) => {
            return response.results.map((series: any) => this.transformSeriesData(series)); 
          }),
          catchError(error => {
            console.error('Error fetching popular series:', error);
            throw error;
          })
        );
    }
      // Transform basic series data to match your Series interface
      private transformSeriesData(series: any): Series {
        return {
          id: series.id,
          title: series.title,
          imageUrl: this.getImageUrl(series.poster_path, 'w342'),
          rating: series.vote_average, // TMDb uses 10-point scale
          ratingCount: series.vote_count,
          seasons: series.number_of_seasons,
          episodes: series.number_of_episodes,
          description: series.overview,
          hasSub: true, // Default values since TMDb doesn't provide this info
          hasDub: false  // Default values since TMDb doesn't provide this info
        };
      }

    private getImageUrl(path: string | null, size: string): string {
      if (!path) {
        return 'assets/images/no-image.png'; // Fallback image
      }
      return `${this.imageBaseUrl}${size}${path}`;
    }
    
      getPopularSeriesWithPagination(page: number = 1): Observable<SeriesResponse> {
        return this.http.get(`${this.apiBaseUrl}/tv/popular?api_key=${this.apiKey}&page=${page}`)
          .pipe(
            map((response: any) => ({
              results: response.results.map((series: any) => this.transformSeriesData(series)),
              total_pages: response.total_pages,
              total_results: response.total_results,
              page: response.page
            })),
            catchError(error => {
              console.error('Error fetching popular series:', error);
              throw error;
            })
          );
      }
}
