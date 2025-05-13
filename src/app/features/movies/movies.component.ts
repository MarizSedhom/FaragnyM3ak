// movies.component.ts
import { Component, NgModule, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Movie } from '../../shared/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MovieService } from '../../services/movie.service';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-movies',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatPaginatorModule,
    MovieCardComponent
  ],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
  ];
  movies: Movie[] = [];
  currentPage = 1;
  maxPages = 1;
  totalMovies = 0;
  isInViewport = false;
  pageSize = 20;
  selectedGenres: number[] = [];
  selectedGenresString = "";
  loading = false;
  category = "now_playing";
  isLoadingDetails = false; // Added for tracking detail loading state

  constructor(private movieService: MovieService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadMovie();
    // Add event listeners to filter-category buttons
    document.querySelectorAll('.filter-category-button').forEach(button => {
      button.addEventListener('click', () => {
        // Remove "active" class from all buttons
        document.querySelectorAll('.filter-category-button').forEach(btn =>
          btn.classList.remove('active')
        );

        // Add "active" class to the clicked button
        button.classList.add('active');
      });
    });
  }

  clearGenres(): void {
    this.selectedGenres = [];
    this.selectedGenresString = "";
    // Clear all checkboxes
    const checkboxes = document.querySelectorAll('.genre-checkbox input') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => checkbox.checked = false);
    this.filterMovies(this.category);
  }

  toggleGenre(genreId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedGenres.push(genreId);
    } else {
      this.selectedGenres = this.selectedGenres.filter(id => id !== genreId);
    }
    this.filterMovies(this.category);
  }

  getSelectedGenresString(): string {
    return this.selectedGenres.join('%2C');
  }

  loadMovie(): void {
    this.loading = true;
    this.movies = [];

    this.movieService.getCertainMoviesWithPagination(this.currentPage, this.selectedGenresString, "now_playing").subscribe({
      next: (response) => {
        this.movies = response.results;
        this.totalMovies = response.total_results;
        this.pageSize = 20;
        this.maxPages = Math.ceil(this.totalMovies / this.pageSize);

        // After loading movies, fetch their details to get durations
        this.loadMovieDetails();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching movies:', error);
        this.loading = false;
      }
    });
  }

  // New method to load movie details after initial list is loaded
  loadMovieDetails(): void {
    if (this.movies.length === 0) return;

    this.isLoadingDetails = true;

    this.movieService.getDetailsForMovies(this.movies)
      .subscribe({
        next: (moviesWithDetails) => {
          this.movies = moviesWithDetails;
          this.isLoadingDetails = false;
        },
        error: (error) => {
          console.error('Error fetching movie details:', error);
          this.isLoadingDetails = false;
        }
      });
  }

  filterMovies(category: string): void {
    this.category = category;
    this.loading = true;
    this.currentPage = 1; // Reset to the first page when changing category
    this.maxPages = 1; // Reset max pages
    this.totalMovies = 0; // Reset total movies count
    this.movies = []; // Clear the current movies list
    this.pageSize = 20; // Reset page size
    this.isInViewport = false; // Reset viewport status
    this.selectedGenresString = this.getSelectedGenresString();

    this.movieService.getCertainMoviesWithPagination(this.currentPage, this.selectedGenresString, category).subscribe({
      next: (response) => {
        this.movies = response.results;
        this.totalMovies = response.total_results;
        this.pageSize = 20;
        this.maxPages = Math.ceil(this.totalMovies / this.pageSize);

        // After loading filtered movies, fetch their details
        this.loadMovieDetails();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching series:', error);
        this.loading = false;
      }
    });
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMovie();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.maxPages) {
      this.currentPage++;
      this.loadMovie();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1; // PageEvent is zero-based, but our API is 1-based
    this.loadMovie();
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  onScroll(): void {
    this.loadMovie();
  }
}
