import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
  isLoadingCarousel: boolean = true;
  hasError: boolean = false;
  hasCarouselError: boolean = false;

  constructor(
    private movieService: MovieService,
    private seriesService: SeriesService,
    private cdr: ChangeDetectorRef // <-- Add this

  ) { }

  ngAfterViewInit(): void {
    this.initializeCarousel();
  }

  initializeCarousel(): void {
    const carouselElement = document.querySelector('#carouselExampleIndicators');
    if (carouselElement && this.images.length > 0 && !this.hasCarouselError) {
      // Make sure any previous carousel instance is disposed
      const existingCarousel = bootstrap.Carousel.getInstance(carouselElement);
      if (existingCarousel) {
        existingCarousel.dispose();
      }
      // Initialize a new carousel
      new bootstrap.Carousel(carouselElement, {
        interval: 2000,
        ride: 'carousel',
        pause: false
      });
    }
  }

  retry(): void {
    this.loadCarouselImages();
    this.loadMoviesAndSeries();
  }
  retryCarousel(): void {
    this.isLoadingCarousel = true;
    this.hasCarouselError = false;
    this.loadCarouselImages();
  }

  ngOnInit(): void {
    this.loadCarouselImages();
    this.loadMoviesAndSeries();
  }

  loadMoviesAndSeries(): void {
    // Use forkJoin to fetch both movies and series in parallel
    forkJoin({
      movies: this.movieService.AdmingetTopRatedMovies().pipe(
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
        this.movies = Array.isArray(results.movies) ? results.movies : results.movies.movies;
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
    // Set loading state
    this.isLoadingCarousel = true;

    // Simulate loading time for carousel images
    setTimeout(() => {
      try {
        this.images = [
          { src: 'https://awesomefriday.ca/2014/05/review-x-men-days-of-future-past/x-men-days-of-future-past-banner/', alt: 'Xmen' },
          { src: 'https://wallpapercave.com/wp/wp14769056.jpg', alt: 'Arcane' },
          { src: 'https://wallpapercave.com/wp/wp5435745.jpg', alt: 'Venom' },
          { src: 'https://wallpapercave.com/wp/wp6085066.jpg', alt: 'Jujutsu Kaisen' },
          { src: 'https://wallpapercave.com/wp/wp12507537.jpg', alt: 'DareDevil' },
          { src: 'https://mrwallpaper.com/images/hd/the-batman-title-poster-j2ft6omd0csyg22b.jpg', alt: 'batman' }
        ];

        this.isLoadingCarousel = false;

        // Mark for change detection and initialize the carousel after view has been updated
        this.cdr.detectChanges();

        // Use requestAnimationFrame instead of setTimeout for better timing
        requestAnimationFrame(() => {
          this.initializeCarousel();
        });
      } catch (error) {
        console.error('Error loading carousel images:', error);
        this.hasCarouselError = true;
        this.isLoadingCarousel = false;
      }
    }, 500); // Simulate 1 second loading time
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
