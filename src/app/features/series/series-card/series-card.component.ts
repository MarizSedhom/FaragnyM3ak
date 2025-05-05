import { Component,Input } from '@angular/core';
import { Series } from '../Model/series.model';


@Component({
  selector: 'app-series-card',
  imports: [],
  templateUrl: './series-card.component.html',
  styleUrls: ['./series-card.component.scss']
})
export class SeriesCardComponent {
  @Input() series!: Series; // ! indicates that this property will be initialized later
  
  formatRating(rating: number): string {
    return rating.toFixed(1); // Formats to 1 decimal place
  }
  
  formatCount(count: number): string {
    return (count * 1000).toLocaleString(); // Formats with commas
  }
}
