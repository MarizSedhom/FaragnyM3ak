import { Component,Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../shared/models/movie.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatPaginatorModule
  ],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: true,

})
export class MovieCardComponent {
  @Input() movie!: Movie; // ! indicates that this property will be initialized later

  formatRating(rating: number): string {
    return rating.toFixed(1); // Formats to 1 decimal place
  }

  formatCount(count: number): string {
    return (count * 1000).toLocaleString(); // Formats with commas
  }
  formatDuration(minutes: number): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours} hr ${mins} min`;
    } else if (hours > 0) {
      return `${hours} hr`;
    } else {
      return `${mins} min`;
    }
  }
}
