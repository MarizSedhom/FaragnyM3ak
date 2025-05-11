import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartModule } from 'angular-highcharts'; 
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule 
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  movieCountChart!: Chart;
  genrePieChart!: Chart;
  genreData: { genre: string, count: number }[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovieCounts();
    this.loadGenreDistribution();
  }

  loadMovieCounts(): void {
    forkJoin({
      nowPlaying: this.movieService.getNowPlayingMovies(),
      topRated: this.movieService.AdmingetTopRatedMovies(),
      upcoming: this.movieService.getUpcomingMovies(),
      popular: this.movieService.getPopularMoviestotal(),
    }).subscribe({
      next: ({ nowPlaying, topRated, upcoming, popular }) => {
        this.movieCountChart = new Chart({
          chart: {
            type: 'column'
          },
          title: {
            text: 'Movie Categories Count'
          },
          xAxis: {
            categories: ['Now Playing', 'Top Rated', 'Upcoming', 'Popular']
          },
          yAxis: {
            type: 'logarithmic',
            title: {
              text: 'Number of Movies'
            },
            allowDecimals: false,
            min: 1
          },
          series: [
            {
              name: 'Movies',
              data: [
                nowPlaying.totalResults,
                topRated.totalResults,
                upcoming.totalResults,
                popular.totalResults
              ],
              type: 'column',
              colorByPoint: true
            }
          ]
        });
      },
      error: (err) => {
        console.error('Error loading movie counts', err);
      }
    });
  }

  loadGenreDistribution(): void {
    this.movieService.getGenreDistribution().subscribe(data => {
      this.genreData = data;
      this.genrePieChart = new Chart({
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Genre Distribution (Now Playing)'
        },
        series: [
          {
            name: 'Genres',
            data: data.map(item => ({
              name: item.genre,
              y: item.count
            })),
            type: 'pie'
          }
        ]
      });
    });
  }
}
