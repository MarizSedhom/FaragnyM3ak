import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Series } from '../../shared/models/series.model';
import { SeriesCardComponent } from '../../shared/components/series-card/series-card.component';
import { ActivatedRoute } from '@angular/router';
import { SeriesService } from '../../services/Series/series.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-series',
  imports: [CommonModule, SeriesCardComponent, FormsModule],
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})

export class SeriesComponent implements OnInit {

  loading = false;
  series: Series[] = [];
  currentPage = 1;
  totalSeries = 0;
  isInViewport = false;
  pageSize = 20;
  maxPages = 1;

  constructor(private seriesService: SeriesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
      this.loadSeries();
  }


loadSeries(): void {
  this.loading = true;
  this.seriesService.getPopularSeriesWithPagination(this.currentPage).subscribe({
    next: (response) => {
      this.series = response.results;
      this.totalSeries = response.total_results;
      this.pageSize = 20;
      this.maxPages = Math.ceil(this.totalSeries / this.pageSize);
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
    this.loadSeries();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

goToNextPage(): void {
  if (this.currentPage < this.maxPages) {
    this.currentPage++;
    this.loadSeries();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

  onPageChange(event : PageEvent) : void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadSeries();
    window.scrollTo({top:0, behavior: 'smooth'}); 
  }

  onScroll(): void {
      this.loadSeries();
  }
}