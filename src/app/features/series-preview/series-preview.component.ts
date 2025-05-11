import { SeriesCardComponent } from '../../shared/components/series-card/series-card.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeriesService } from '../../services/series.service';
import { Series, SeriesCast } from '../../shared/models/series.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin, of, catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import{UserListsService} from'../../features/profile/services/user-lists.service';


@Component({
  selector: 'app-series-preview',
  standalone:true,
  imports: [CommonModule, HttpClientModule, SeriesCardComponent],
  templateUrl: './series-preview.component.html',
  styleUrls: ['./series-preview.component.scss']
})
export class SeriesPreviewComponent implements OnInit {
  series: Series | null = null;
  similarSeries: Series[] = [];
  seriesCast: SeriesCast[] = [];
  seasonEpisodeCounts: { [key: number]: number } = {};

  loading = true;
  error: string | null = null;
  activeTab = 'similar';
  isFavorite = false;

  trailerUrl: string | null = null;
  safeTrailerUrl: SafeResourceUrl | null = null;
  showTrailer = false;

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService,
    private sanitizer: DomSanitizer,
    private listServices:UserListsService
  ) { }

  /*ngOnInit(): void {
    this.loadSeriesData();
  }*/

    ngOnInit(): void {
  // Listen to changes in the route parameter (id)
  this.route.paramMap.subscribe(params => {
    const seriesId = params.get('id');
    if (seriesId) {
      this.loadSeriesData(seriesId); // Pass seriesId directly
    } else {
      this.error = 'Series ID not found';
      this.loading = false;
    }
  });
}

loadSeriesData(seriesId: string): void {
  this.loading = true;
  this.error = null;

  forkJoin({
    series: this.seriesService.getSeriesById(seriesId),
    similar: this.seriesService.getSimilarSeries(seriesId).pipe(catchError(() => of([]))),
    cast: this.seriesService.getSeriesCast(seriesId).pipe(catchError(() => of([]))),
    trailer: this.seriesService.getSeriesTrailers(seriesId).pipe(catchError(() => of(null)))
  }).subscribe({
    next: (data) => {
      this.series = data.series;
      this.similarSeries = data.similar;
      this.seriesCast = data.cast;

      // Trailer
      this.trailerUrl = data.trailer;
      if (this.trailerUrl) {
        this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${this.trailerUrl}`
        );
      }

      // Load season episode counts
      if (this.series && this.series.seasons! > 0) {
        this.seriesService.getAllSeasonEpisodeCounts(seriesId, this.series.seasons!)
          .subscribe(counts => {
            this.seasonEpisodeCounts = counts;
          });
      }

      this.loading = false;
    },
    error: (err) => {
      console.error('Error loading series data:', err);
      this.error = 'Failed to load series data. Please try again.';
      this.loading = false;
    }
  });
}


/*
  loadSeriesData(): void {
    this.loading = true;
    this.error = null;

    const seriesId = this.route.snapshot.paramMap.get('id');

    if (!seriesId) {
      this.error = 'Series ID not found';
      this.loading = false;
      return;
    }

    // Use forkJoin to fetch all data in parallel
    forkJoin({
      series: this.seriesService.getSeriesById(seriesId),
      similar: this.seriesService.getSimilarSeries(seriesId).pipe(catchError(() => of([]))),
      cast: this.seriesService.getSeriesCast(seriesId).pipe(catchError(() => of([]))),
      trailer: this.seriesService.getSeriesTrailers(seriesId).pipe(catchError(() => of(null)))
    }).subscribe({
      next: (data) => {
        this.series = data.series;
        this.similarSeries = data.similar;
        this.seriesCast = data.cast;

        // Handle trailer
        this.trailerUrl = data.trailer;
        if (this.trailerUrl) {
          this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${this.trailerUrl}`
          );
        }

        // Load season episode counts if there are seasons
        if (this.series && this.series.seasons! > 0) {
          this.seriesService.getAllSeasonEpisodeCounts(seriesId, this.series.seasons!)
            .subscribe(counts => {
              this.seasonEpisodeCounts = counts;
            });
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading series data:', err);
        this.error = 'Failed to load series data. Please try again.';
        this.loading = false;
      }
    });
  }
*/
  // Format a date to a more readable format
  formatDate(dateString: string): string {
    if (!dateString) return 'Unknown';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Get year from date string
  getYear(dateString: string): number | null {
    if (!dateString) return null;
    return new Date(dateString).getFullYear();
  }

  // Get an array of numbers from 1 to n
  getNumberArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

  // Get episode count for a specific season
  getSeasonEpisodeCount(seasonNumber: number): number {
    return this.seasonEpisodeCounts[seasonNumber] || 0;
  }

  // Format cast members for display
  formatCast(cast: SeriesCast[]): string {
    if (!cast || cast.length === 0) return 'No cast information';
    return cast.map(actor => actor.name).join(', ');
  }

  retry(): void {
    this.loadSeriesData(this.series!.id.toString());
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    // TODO: Implement actual favorite functionality with a service
    if(this.isFavorite){
      this.listServices.addSeriesToFavorites(this.series!.id.toString())
    }
    else{
      this.listServices.removeSeriesFromFavorites(this.series!.id.toString())
    }
  }
}
