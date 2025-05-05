import { Component,Input } from '@angular/core';
import { Movie } from '../Model/movie.model';


@Component({
  selector: 'app-movie-card',
  imports: [],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
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
