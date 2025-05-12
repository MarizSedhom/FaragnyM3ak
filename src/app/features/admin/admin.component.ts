import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartModule } from 'angular-highcharts';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { SeriesService } from '../../services/series.service';
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
  releasechart!: Chart;

  genreData: { genre: string, count: number }[] = [];

  movieData: number[] = [];
  seriesData: number[] = [];

  movieCategories = ['Now Playing', 'Top Rated', 'Upcoming', 'Popular'];
  seriesCategories = ['Airing Today', 'On The Air', 'Popular', 'Top Rated'];

  currentBarChartView: 'Movies' | 'Series' = 'Movies';
  currentLineChartView: 'Movies' | 'Series' = 'Movies';

  startDate: string = '';
  endDate: string = '';

  seriesDateData: { [key: string]: number } = {};

  constructor(private movieService: MovieService, private seriesService: SeriesService) {}

  ngOnInit(): void {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 6);
    this.startDate = lastWeek.toISOString().split('T')[0];


    this.onStartDateChange();

    this.loadDataAndInitChart();
    this.loadGenreDistribution();
    this.loadMoviesByReleaseDate();
    this.loadSeriesByReleaseDate();
  }

  onStartDateChange(): void {
    if (this.startDate) {
      const start = new Date(this.startDate);
      start.setDate(start.getDate() + 6);
      this.endDate = start.toISOString().split('T')[0];
    }
  }

  loadDataAndInitChart(): void {
    forkJoin({
      nowPlaying: this.movieService.getNowPlayingMovies(),
      topRated: this.movieService.AdmingetTopRatedMovies(),
      upcoming: this.movieService.getUpcomingMovies(),
      popular: this.movieService.getPopularMoviestotal(),
      airingToday: this.seriesService.AdmingetAiringTodaySeries(),
      onTheAir: this.seriesService.AdmingetOnTheAirSeries(),
      popularSeries: this.seriesService.AdmingetPopularSeries(),
      topRatedSeries: this.seriesService.AdmingetTopRatedSeries(),
    }).subscribe({
      next: ({ nowPlaying, topRated, upcoming, popular, airingToday, onTheAir, popularSeries, topRatedSeries }) => {
        this.movieData = [
          nowPlaying.totalResults,
          topRated.totalResults,
          upcoming.totalResults,
          popular.totalResults
        ];

        this.seriesData = [
          airingToday.totalResults,
          onTheAir.totalResults,
          popularSeries.totalResults,
          topRatedSeries.totalResults
        ];

        this.renderChart(this.movieData, this.movieCategories, 'Movies');
      },
      error: (err) => {
        console.error('Error loading data', err);
      }
    });
  }

  loadMoviesByReleaseDate(): void {
    if (!this.startDate || !this.endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    if (this.startDate > this.endDate) {
      alert('Start date cannot be after end date.');
      return;
    }

    this.movieService.getMoviesByDateRange(this.startDate, this.endDate).subscribe({
      next: (response) => {
        const grouped = this.groupByReleaseDate(response);
        this.renderReleaseDateChart(grouped, 'Movies');
      },
      error: (err) => {
        console.error('Error fetching movies by date', err);
      }
    });
  }

  loadSeriesByReleaseDate(): void {
    if (!this.startDate || !this.endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    if (this.startDate > this.endDate) {
      alert('Start date cannot be after end date.');
      return;
    }

    this.seriesService.getTVSeriesByDateRange(this.startDate, this.endDate).subscribe({
      next: (response) => {
        this.seriesDateData = this.groupByFirstAirDate(response);
        if (this.currentLineChartView === 'Series') {
          this.renderReleaseDateChart(this.seriesDateData, 'Series');
        }
      },
      error: (err) => {
        console.error('Error fetching series by date', err);
      }
    });
  }

  groupByReleaseDate(movies: any[]): { [key: string]: number } {
    const countByDate: { [key: string]: number } = {};
    movies.forEach(movie => {
      const date = movie.release_date;
      if (date) {
        countByDate[date] = (countByDate[date] || 0) + 1;
      }
    });
    return countByDate;
  }

  groupByFirstAirDate(series: any[]): { [key: string]: number } {
    const countByDate: { [key: string]: number } = {};
    series.forEach(tv => {
      const date = tv.first_air_date;
      if (date) {
        countByDate[date] = (countByDate[date] || 0) + 1;
      }
    });
    return countByDate;
  }

  renderChart(data: number[], categories: string[], name: string): void {
    this.movieCountChart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: `${name} Categories Count`
      },
      xAxis: {
        categories
      },
      yAxis: {
        type: 'logarithmic',
        title: {
          text: `Number of ${name}`
        },
        allowDecimals: false,
        min: 1
      },
      plotOptions: {
        series: {
          events: {
            legendItemClick: (event) => {
              event.preventDefault();
              this.toggleBarChartView();
              return false;
            }
          }
        }
      },
      series: [
        {
          name,
          data,
          type: 'column',
          colorByPoint: true
        }
      ]
    });
  }

  toggleBarChartView(): void {
    if (this.currentBarChartView === 'Movies') {
      this.currentBarChartView = 'Series';
      this.renderChart(this.seriesData, this.seriesCategories, 'Series');
    } else {
      this.currentBarChartView = 'Movies';
      this.renderChart(this.movieData, this.movieCategories, 'Movies');
    }
  }

  renderReleaseDateChart(groupedData: { [key: string]: number }, type: 'Movies' | 'Series'): void {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const dates: string[] = [];
    const counts: number[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const formattedDate = d.toISOString().split('T')[0];
      dates.push(formattedDate);
      counts.push(groupedData[formattedDate] || 0);
    }

    this.releasechart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: `Number of ${type} Released Per Day`
      },
      xAxis: {
        categories: dates,
        title: { text: 'Date' },
        labels: { rotation: -45 }
      },
      yAxis: {
        title: { text: `Number of ${type}` },
        allowDecimals: false
      },
      plotOptions: {
        series: {
          events: {
            legendItemClick: (event) => {
              event.preventDefault();
              this.toggleLineChartView();
              return false;
            }
          }
        }
      },
      series: [{
        type: 'line',
        name: type,
        data: counts,
        color: type === 'Movies' ? '#007bff' : '#28a745'
      }]
    });
  }

  toggleLineChartView(): void {
    if (this.currentLineChartView === 'Movies') {
      this.currentLineChartView = 'Series';
      this.renderReleaseDateChart(this.seriesDateData, 'Series');
    } else {
      this.currentLineChartView = 'Movies';
      this.loadMoviesByReleaseDate(); // fetch fresh movie data and update line chart
    }
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

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Chart, ChartModule } from 'angular-highcharts';
// import { FormsModule } from '@angular/forms';
// import { MovieService } from '../../services/movie.service';
// import { SeriesService } from '../../services/series.service';
// import { forkJoin } from 'rxjs';

// @Component({
//   selector: 'app-admin',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ChartModule
//   ],
//   templateUrl: './admin.component.html',
//   styleUrls: ['./admin.component.scss']
// })
// export class AdminComponent implements OnInit {

//   movieCountChart!: Chart;
//   genrePieChart!: Chart;
//   releasechart!: Chart;

//   genreData: { genre: string, count: number }[] = [];
//   seriesGenreData: { genre: string, count: number }[] = [];

//   movieData: number[] = [];
//   seriesData: number[] = [];

//   movieCategories = ['Now Playing', 'Top Rated', 'Upcoming', 'Popular'];
//   seriesCategories = ['Airing Today', 'On The Air', 'Popular', 'Top Rated'];

//   currentBarChartView: 'Movies' | 'Series' = 'Movies';
//   currentLineChartView: 'Movies' | 'Series' = 'Movies';
//   currentPieChartView: 'Movies' | 'Series' = 'Movies';

//   startDate: string = '';
//   endDate: string = '';

//   seriesDateData: { [key: string]: number } = {};

//   constructor(private movieService: MovieService, private seriesService: SeriesService) {}

//   ngOnInit(): void {
//     const today = new Date();
//     const lastWeek = new Date(today);
//     lastWeek.setDate(today.getDate() - 6);
//     this.startDate = lastWeek.toISOString().split('T')[0];

//     this.onStartDateChange();
//     this.loadDataAndInitChart();
//     this.loadGenreDistribution();
//     this.loadMoviesByReleaseDate();
//     this.loadSeriesByReleaseDate();
//   }

//   onStartDateChange(): void {
//     if (this.startDate) {
//       const start = new Date(this.startDate);
//       start.setDate(start.getDate() + 6);
//       this.endDate = start.toISOString().split('T')[0];
//     }
//   }

//   loadDataAndInitChart(): void {
//     forkJoin({
//       nowPlaying: this.movieService.getNowPlayingMovies(),
//       topRated: this.movieService.AdmingetTopRatedMovies(),
//       upcoming: this.movieService.getUpcomingMovies(),
//       popular: this.movieService.getPopularMoviestotal(),
//       airingToday: this.seriesService.AdmingetAiringTodaySeries(),
//       onTheAir: this.seriesService.AdmingetOnTheAirSeries(),
//       popularSeries: this.seriesService.AdmingetPopularSeries(),
//       topRatedSeries: this.seriesService.AdmingetTopRatedSeries(),
//     }).subscribe({
//       next: ({ nowPlaying, topRated, upcoming, popular, airingToday, onTheAir, popularSeries, topRatedSeries }) => {
//         this.movieData = [
//           nowPlaying.totalResults,
//           topRated.totalResults,
//           upcoming.totalResults,
//           popular.totalResults
//         ];

//         this.seriesData = [
//           airingToday.totalResults,
//           onTheAir.totalResults,
//           popularSeries.totalResults,
//           topRatedSeries.totalResults
//         ];

//         this.renderChart(this.movieData, this.movieCategories, 'Movies');
//       },
//       error: (err) => {
//         console.error('Error loading data', err);
//       }
//     });
//   }

//   loadMoviesByReleaseDate(): void {
//     if (!this.startDate || !this.endDate) {
//       alert('Please select both start and end dates.');
//       return;
//     }

//     if (this.startDate > this.endDate) {
//       alert('Start date cannot be after end date.');
//       return;
//     }

//     this.movieService.getMoviesByDateRange(this.startDate, this.endDate).subscribe({
//       next: (response) => {
//         const grouped = this.groupByReleaseDate(response);
//         this.renderReleaseDateChart(grouped, 'Movies');
//       },
//       error: (err) => {
//         console.error('Error fetching movies by date', err);
//       }
//     });
//   }

//   loadSeriesByReleaseDate(): void {
//     if (!this.startDate || !this.endDate) {
//       alert('Please select both start and end dates.');
//       return;
//     }

//     if (this.startDate > this.endDate) {
//       alert('Start date cannot be after end date.');
//       return;
//     }

//     this.seriesService.getTVSeriesByDateRange(this.startDate, this.endDate).subscribe({
//       next: (response) => {
//         this.seriesDateData = this.groupByFirstAirDate(response);
//         if (this.currentLineChartView === 'Series') {
//           this.renderReleaseDateChart(this.seriesDateData, 'Series');
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching series by date', err);
//       }
//     });
//   }

//   groupByReleaseDate(movies: any[]): { [key: string]: number } {
//     const countByDate: { [key: string]: number } = {};
//     movies.forEach(movie => {
//       const date = movie.release_date;
//       if (date) {
//         countByDate[date] = (countByDate[date] || 0) + 1;
//       }
//     });
//     return countByDate;
//   }

//   groupByFirstAirDate(series: any[]): { [key: string]: number } {
//     const countByDate: { [key: string]: number } = {};
//     series.forEach(tv => {
//       const date = tv.first_air_date;
//       if (date) {
//         countByDate[date] = (countByDate[date] || 0) + 1;
//       }
//     });
//     return countByDate;
//   }

//   renderChart(data: number[], categories: string[], name: string): void {
//     this.movieCountChart = new Chart({
//       chart: { type: 'column' },
//       title: { text: `${name} Categories Count` },
//       xAxis: { categories },
//       yAxis: {
//         type: 'logarithmic',
//         title: { text: `Number of ${name}` },
//         allowDecimals: false,
//         min: 1
//       },
//       plotOptions: {
//         series: {
//           events: {
//             legendItemClick: (event) => {
//               event.preventDefault();
//               this.toggleBarChartView();
//               return false;
//             }
//           }
//         }
//       },
//       series: [{ name, data, type: 'column', colorByPoint: true }]
//     });
//   }

//   toggleBarChartView(): void {
//     if (this.currentBarChartView === 'Movies') {
//       this.currentBarChartView = 'Series';
//       this.renderChart(this.seriesData, this.seriesCategories, 'Series');
//     } else {
//       this.currentBarChartView = 'Movies';
//       this.renderChart(this.movieData, this.movieCategories, 'Movies');
//     }
//   }

//   renderReleaseDateChart(groupedData: { [key: string]: number }, type: 'Movies' | 'Series'): void {
//     const start = new Date(this.startDate);
//     const end = new Date(this.endDate);
//     const dates: string[] = [];
//     const counts: number[] = [];

//     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//       const formattedDate = d.toISOString().split('T')[0];
//       dates.push(formattedDate);
//       counts.push(groupedData[formattedDate] || 0);
//     }

//     this.releasechart = new Chart({
//       chart: { type: 'line' },
//       title: { text: `Number of ${type} Released Per Day` },
//       xAxis: {
//         categories: dates,
//         title: { text: 'Date' },
//         labels: { rotation: -45 }
//       },
//       yAxis: {
//         title: { text: `Number of ${type}` },
//         allowDecimals: false
//       },
//       plotOptions: {
//         series: {
//           events: {
//             legendItemClick: (event) => {
//               event.preventDefault();
//               this.toggleLineChartView();
//               return false;
//             }
//           }
//         }
//       },
//       series: [{ type: 'line', name: type, data: counts, color: type === 'Movies' ? '#007bff' : '#28a745' }]
//     });
//   }

//   toggleLineChartView(): void {
//     if (this.currentLineChartView === 'Movies') {
//       this.currentLineChartView = 'Series';
//       this.renderReleaseDateChart(this.seriesDateData, 'Series');
//     } else {
//       this.currentLineChartView = 'Movies';
//       this.loadMoviesByReleaseDate();
//     }
//   }

//   loadGenreDistribution(): void {
//     this.movieService.getGenreDistribution().subscribe(data => {
//       this.genreData = data;
//       this.renderGenrePieChart(data);
//     });
//   }

//   renderGenrePieChart(data: { genre: string, count: number }[]): void {
//     this.genrePieChart = new Chart({
//       chart: { type: 'pie' },
//       title: { text: `Genre Distribution (${this.currentPieChartView})` },
//       plotOptions: {
//         pie: {
//           allowPointSelect: true,
//           cursor: 'pointer',
//           dataLabels: { enabled: true }
//         },
//         series: {
//           events: {
//             legendItemClick: (event) => {
//               event.preventDefault();
//               this.togglePieChartView();
//               return false;
//             }
//           }
//         }
//       },
//       series: [
//         {
//           name: 'Genres',
//           data: data.map(item => ({ name: item.genre, y: item.count })),
//           type: 'pie'
//         }
//       ]
//     });
//   }

//   togglePieChartView(): void {
//     this.currentPieChartView = this.currentPieChartView === 'Movies' ? 'Series' : 'Movies';
//     if (this.currentPieChartView === 'Movies') {
//       this.loadGenreDistribution();
//     } else {
//       this.seriesService.getGenres().subscribe(data => {
//         this.seriesGenreData = data;
//         this.renderGenrePieChart(data);
//       });
//     }
//   }
// }

