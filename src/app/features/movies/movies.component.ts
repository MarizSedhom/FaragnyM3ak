// movies.component.ts
import { Component, NgModule,Input, OnInit } from '@angular/core';
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
  loading = false;

  constructor(private movieService: MovieService, private route: ActivatedRoute)  {}

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
// Toggle genre selection
toggleGenre(genreId: number, event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked;
  if (isChecked) {
    this.selectedGenres.push(genreId);
  } else {
    this.selectedGenres = this.selectedGenres.filter(id => id !== genreId);
  }
}

// Get comma-separated string of selected genres
getSelectedGenresString(): string {
  return this.selectedGenres.join(',');
}

// Example: Log selected genres when a button is clicked
logSelectedGenres() {
  console.log('Selected Genre IDs:', this.getSelectedGenresString());
}

loadMovie(): void {
  this.loading = true;
  this.movieService.getNowPlayingMoviesWithPagination(this.currentPage).subscribe({
    next: (response) => {
      this.movies = response.results;
      this.totalMovies = response.total_results;
      this.pageSize = 20;
      this.maxPages = Math.ceil(this.totalMovies / this.pageSize);
      this.loading = false;
    },
    error: (error) => {
      console.error('Error fetching movies:', error);
      this.loading = false;
    }
  });
}
filterMovies(category: string): void {
    this.loading = true;
    this.currentPage = 1; // Reset to the first page when changing category
    this.maxPages = 1; // Reset max pages
    this.totalMovies = 0; // Reset total movies count
    this.movies = []; // Clear the current movies list
    this.pageSize = 20; // Reset page size
    this.isInViewport = false; // Reset viewport status

    switch (category) {
      case 'now_playing':
        this.movieService.getNowPlayingMoviesWithPagination(this.currentPage).subscribe({
          next: (response) => {
            this.movies = response.results;
            this.totalMovies = response.total_results;
            this.pageSize = 20;
            this.maxPages = Math.ceil(this.totalMovies / this.pageSize);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching series:', error);
            this.loading = false;
          }
        });
        break;
      case 'popular':
        this.movieService.getPopularMoviesWithPagination(this.currentPage).subscribe({
          next: (response) => {
            this.movies = response.results;
            this.totalMovies = response.total_results;
            this.pageSize = 20;
            this.maxPages = Math.ceil(this.totalMovies / this.pageSize);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching series:', error);
            this.loading = false;
          }
        });
        break;
      case 'top_rated':
        this.movieService.getTopRatedMoviesWithPagination(this.currentPage).subscribe({
          next: (response) => {
            this.movies = response.results;
            this.totalMovies = response.total_results;
            this.pageSize = 20;
            this.maxPages = Math.ceil(this.totalMovies / this.pageSize);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching series:', error);
            this.loading = false;
          }
        });
        break;
      case 'upcoming':
        this.movieService.getUpcomingMoviesWithPagination(this.currentPage).subscribe({
          next: (response) => {
            this.movies = response.results;
            this.totalMovies = response.total_results;
            this.pageSize = 20;
            this.maxPages = Math.ceil(this.totalMovies / this.pageSize);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching series:', error);
            this.loading = false;
          }
        });
        break;
      default:
        this.loading = false;
        break;
    }
  };



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

  onPageChange(event : PageEvent) : void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadMovie();
    window.scrollTo({top:0, behavior: 'smooth'}); 
  }

  onScroll(): void {
      this.loadMovie();
  }
}
