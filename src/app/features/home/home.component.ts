import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Movie } from '../../shared/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { Series } from '../../shared/models/series.model';
import { SeriesCardComponent } from '../../shared/components/series-card/series-card.component';
import { MovieService } from '../../services/movie.service';
import { SeriesService } from '../../services/series.service';
import { forkJoin, catchError, of } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, MovieCardComponent, SeriesCardComponent, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  images: { src: string, alt: string }[] = [];

  // These will be populated from API
  movies: Movie[] = [];
  series: Series[] = [];

  searchQuery: string = '';
  filteredMovies: Movie[] = [];
  filteredSeries: Series[] = [];
  movieGroups: Movie[][] = [];
  seriesGroups: Series[][] = [];
  currentMovieGroup = 0;
  currentSeriesGroup = 0;

  // Loading states
  isLoadingMovies: boolean = true;
  isLoadingSeries: boolean = true;
  hasError: boolean = false;

  constructor(
    private movieService: MovieService,
    private seriesService: SeriesService
  ) {}

  ngAfterViewInit(): void {
    const carouselElement = document.querySelector('#carouselExampleIndicators');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 2000,
        ride: 'carousel',
        pause: false
      });
    }
  }

  ngOnInit(): void {
    this.loadCarouselImages();
    this.loadMoviesAndSeries();
  }

  loadMoviesAndSeries(): void {
    // Use forkJoin to fetch both movies and series in parallel
    forkJoin({
      movies: this.movieService.getTopRatedMovies().pipe(
        catchError(error => {
          console.error('Error loading movies:', error);
          this.hasError = true;
          return of([]);
        })
      ),
      series: this.seriesService.getTopRatedSeries().pipe(
        catchError(error => {
          console.error('Error loading series:', error);
          this.hasError = true;
          return of([]);
        })
      )
    }).subscribe({
      next: (results) => {
        // Process movies
        this.movies = results.movies;
        this.filteredMovies = [...this.movies];
        this.isLoadingMovies = false;
        this.groupMovies();

        // Process series
        this.series = results.series;
        this.filteredSeries = [...this.series];
        this.isLoadingSeries = false;
        this.groupSeries();
      },
      error: (error) => {
        console.error('Error in forkJoin:', error);
        this.hasError = true;
        this.isLoadingMovies = false;
        this.isLoadingSeries = false;
      }
    });
  }

  loadCarouselImages(): void {
    // Keep the existing carousel images
    this.images = [
      { src: 'https://awesomefriday.ca/2014/05/review-x-men-days-of-future-past/x-men-days-of-future-past-banner/', alt: 'First slide' },
      { src: 'https://lumiere-a.akamaihd.net/v1/images/image_d93db6a1.jpeg?region=0,0,760,328', alt: 'Second slide' },
      { src: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/02/up-movie-poster.jpg', alt: 'Third slide' }
    ];
  }

  filterMovies() {
    if (!this.searchQuery) {
      this.filteredMovies = [...this.movies];
    } else {
      this.filteredMovies = this.movies.filter(movie =>
        movie.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.currentMovieGroup = 0;
    this.groupMovies();
  }

  filterSeries() {
    if (!this.searchQuery) {
      this.filteredSeries = [...this.series];
    } else {
      this.filteredSeries = this.series.filter(series =>
        series.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.currentSeriesGroup = 0;
    this.groupSeries();
  }

  groupMovies(): void {
    const groupSize = 5;
    this.movieGroups = [];

    for (let i = 0; i < this.filteredMovies.length; i += groupSize) {
      this.movieGroups.push(this.filteredMovies.slice(i, i + groupSize));
    }
  }

  groupSeries(): void {
    const groupSize = 5;
    this.seriesGroups = [];

    for (let i = 0; i < this.filteredSeries.length; i += groupSize) {
      this.seriesGroups.push(this.filteredSeries.slice(i, i + groupSize));
    }
  }

  nextMovieGroup(): void {
    if (this.currentMovieGroup < this.movieGroups.length - 1) {
      this.currentMovieGroup++;
    }
  }

  prevMovieGroup(): void {
    if (this.currentMovieGroup > 0) {
      this.currentMovieGroup--;
    }
  }

  nextSeriesGroup(): void {
    if (this.currentSeriesGroup < this.seriesGroups.length - 1) {
      this.currentSeriesGroup++;
    }
  }

  prevSeriesGroup(): void {
    if (this.currentSeriesGroup > 0) {
      this.currentSeriesGroup--;
    }
  }
}
