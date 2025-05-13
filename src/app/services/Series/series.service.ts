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
    
      getCertainSeriesWithPagination(page: number = 1, selectedGenresString: string,category: string): Observable<SeriesResponse> {
        if (selectedGenresString != "") {
          return this.http.get(`${this.apiBaseUrl}/discover/tv?api_key=${this.apiKey}&with_genres=${selectedGenresString}&page=${page}`)
          .pipe(
              map((response: any) => ({
                results: response.results.map((movie: any) => this.transformSeriesData(movie)),
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
          return this.http.get(`${this.apiBaseUrl}/tv/${category}?api_key=${this.apiKey}&page=${page}}`)
            .pipe(
              map((response: any) => ({
                results: response.results.map((movie: any) => this.transformSeriesData(movie)),
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
      // getPopularSeriesWithPagination(page: number = 1): Observable<SeriesResponse> {
      //   return this.http.get(`${this.apiBaseUrl}/tv/popular?api_key=${this.apiKey}&page=${page}`)
      //     .pipe(
      //       map((response: any) => ({
      //         results: response.results.map((series: any) => this.transformSeriesData(series)),
      //         total_pages: response.total_pages,
      //         total_results: response.total_results,
      //         page: response.page
      //       })),
      //       catchError(error => {
      //         console.error('Error fetching popular series:', error);
      //         throw error;
      //       })
      //     );
      // }
      // getAiringTodaySeriesWithPagination(page: number = 1): Observable<SeriesResponse> {
      //   return this.http.get(`${this.apiBaseUrl}/tv/airing_today?api_key=${this.apiKey}&page=${page}`)
      //     .pipe(
      //       map((response: any) => ({
      //         results: response.results.map((series: any) => this.transformSeriesData(series)),
      //         total_pages: response.total_pages,
      //         total_results: response.total_results,
      //         page: response.page
      //       })),
      //       catchError(error => {
      //         console.error('Error fetching airing today series:', error);
      //         throw error;
      //       })
      //     );
      // }
      // getOnTheAirSeriesWithPagination(page: number = 1): Observable<SeriesResponse> {
      //   return this.http.get(`${this.apiBaseUrl}/tv/on_the_air?api_key=${this.apiKey}&page=${page}`)
      //     .pipe(
      //       map((response: any) => ({
      //         results: response.results.map((series: any) => this.transformSeriesData(series)),
      //         total_pages: response.total_pages,
      //         total_results: response.total_results,
      //         page: response.page
      //       })),
      //       catchError(error => {
      //         console.error('Error fetching on-the-air series:', error);
      //         throw error;
      //       })
      //     );
      // }
      // getTopRatedSeriesWithPagination(page: number = 1): Observable<SeriesResponse> {
      //   return this.http.get(`${this.apiBaseUrl}/tv/top_rated?api_key=${this.apiKey}&page=${page}`)
      //     .pipe(
      //       map((response: any) => ({
      //         results: response.results.map((series: any) => this.transformSeriesData(series)),
      //         total_pages: response.total_pages,
      //         total_results: response.total_results,
      //         page: response.page
      //       })),
      //       catchError(error => {
      //         console.error('Error fetching top-rated series:', error);
      //         throw error;
      //       })
      //     );
      // }
}
