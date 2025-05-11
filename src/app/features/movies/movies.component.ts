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
  loading = false;
  movies: Movie[] = [];
  currentPage = 1;
  maxPages = 1;

  totalMovies = 0;
  isInViewport = false;
  pageSize = 20;
  constructor(private movieService: MovieService, private route: ActivatedRoute)  {}

  ngOnInit(): void {
      this.loadMovie();
  }

loadMovie(): void {
  this.loading = true;
  this.movieService.getPopularMoviesWithPagination(this.currentPage).subscribe({
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
