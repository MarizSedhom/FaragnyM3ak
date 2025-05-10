import { Component,Input } from '@angular/core';
import { Series } from '../../models/series.model';
import { Router } from '@angular/router';
import{UserListsService} from'../../../features/profile/services/user-lists.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-series-card',
  imports: [CommonModule],
  templateUrl: './series-card.component.html',
  styleUrls: ['./series-card.component.scss']
})
export class SeriesCardComponent {
  @Input() series!: Series; // ! indicates that this property will be initialized later

  constructor(private router: Router, private listServices:UserListsService) {}

AddToWatchList(id:string):void{
  this.listServices.addSeriesToWatchlist(id);
}
AddToFavourite(id:string):void{
  this.listServices.addSeriesToFavorites(id);
}

  navigateToSeries(): void {
    this.router.navigate(['/series-preview', this.series.id]);
  }

  formatRating(rating: number): string {
    return rating.toFixed(1); // Formats to 1 decimal place
  }

  formatCount(count: number): string {
    return (count * 1000).toLocaleString(); // Formats with commas
  }
}
