import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-movie-preview',
  imports: [CommonModule],
  templateUrl: './movie-preview.component.html',
  styleUrl: './movie-preview.component.scss'
})
export class MoviePreviewComponent implements OnInit {
  movieId: string | null = null;
  movie: any;
  reviews: any[] = [];
  relatedMovies: any[] = [];
  activeTab: string = 'related';
  userRating: number = 0;
  isFavorite: boolean = false;

  // Simulated static movie data with enhanced fields
  movies = [
    {
      id: '1',
      title: 'Inception',
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      duration: '2h 28m',
      releaseDate: '2010-07-16',
      rating: 'PG-13',
      imdbRating: 8.8,
      overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO, potentially changing the world forever.',
      posterUrl: 'https://images.squarespace-cdn.com/content/v1/5ec686197f8b2976074846c2/1618809593080-N5PB8CWYOW3OPDE2TT6E/Feature+3-1.png',
      backdropUrl: 'https://wallpaperaccess.com/full/1264041.jpg',
      quality: '4K UHD',
      director: 'Christopher Nolan',
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy', 'Ken Watanabe'],
      languages: ['English', 'Japanese', 'French'],
      reviews: [
        { user: 'Alice', stars: 5, comment: 'Mind-blowing movie! The concept of dream-sharing and the visual execution were outstanding. Christopher Nolan outdid himself with this one!', date: 'Apr 12, 2024' },
        { user: 'Bob', stars: 4, comment: 'Great visuals and concept. The plot was a bit confusing at times but overall an amazing experience.', date: 'Feb 3, 2024' },
        { user: 'Charlie', stars: 5, comment: 'One of the best movies I\'ve ever seen. The score by Hans Zimmer perfectly complements the mind-bending narrative.', date: 'Dec 15, 2023' }
      ],
      related: ['2', '3']
    },
    {
      id: '2',
      title: 'The Matrix',
      genres: ['Action', 'Sci-Fi'],
      duration: '2h 16m',
      releaseDate: '1999-03-31',
      rating: 'R',
      imdbRating: 8.7,
      overview: 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.',
      posterUrl: 'https://image.tmdb.org/t/p/original/aOIuZAjPaRIE6CMzbazvcHuHXDc.jpg',
      backdropUrl: 'https://cdn.wallpapersafari.com/92/75/zgZSoF.jpg',
      quality: 'HD',
      director: 'Lana Wachowski, Lilly Wachowski',
      cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss', 'Hugo Weaving'],
      languages: ['English'],
      reviews: [
        { user: 'John', stars: 5, comment: 'Still a masterpiece after all these years. Revolutionary for its time and still holds up today.', date: 'Mar 5, 2024' },
        { user: 'Sarah', stars: 4, comment: 'Amazing action scenes! The "bullet time" sequences were groundbreaking.', date: 'Jan 17, 2024' }
      ],
      related: ['1', '3']
    },
    {
      id: '3',
      title: 'Interstellar',
      genres: ['Adventure', 'Drama', 'Sci-Fi'],
      duration: '2h 49m',
      releaseDate: '2014-11-07',
      rating: 'PG-13',
      imdbRating: 8.6,
      overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      posterUrl: 'https://m.media-amazon.com/images/I/A1JVqNMI7UL._AC_UF894,1000_QL80_.jpg',
      backdropUrl: 'https://images5.alphacoders.com/536/536461.jpg',
      quality: '4K UHD',
      director: 'Christopher Nolan',
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
      languages: ['English'],
      reviews: [
        { user: 'Michael', stars: 5, comment: 'A masterpiece of science fiction. The visuals and soundtrack are incredible.', date: 'Apr 2, 2024' },
        { user: 'Emma', stars: 4, comment: 'Beautiful and emotional. Some scientific concepts were hard to grasp but the story was compelling.', date: 'Feb 28, 2024' }
      ],
      related: ['1', '2']
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
    this.movie = this.movies.find(m => m.id === this.movieId);

    if (this.movie) {
      this.reviews = this.movie.reviews || [];

      // Get related movies based on the related array
      if (this.movie.related && this.movie.related.length) {
        this.relatedMovies = this.movies
          .filter(m => this.movie.related.includes(m.id))
          .map(movie => ({
            ...movie,
            matchPercentage: this.calculateMatchPercentage(movie)
          }));
      }
    }
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  setUserRating(rating: number): void {
    this.userRating = rating;
  }

  getStarsArray(count: number): any[] {
    return new Array(count);
  }

  getYear(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Calculate a fake match percentage based on genres similarity
  private calculateMatchPercentage(movie: any): number {
    if (!this.movie || !movie) return 70; // Default

    const currentGenres = new Set(this.movie.genres);
    const comparedGenres = new Set(movie.genres);

    let commonGenres = 0;
    comparedGenres.forEach(genre => {
      if (currentGenres.has(genre)) commonGenres++;
    });

    const maxGenres = Math.max(currentGenres.size, comparedGenres.size);
    const similarity = commonGenres / maxGenres;

    // Return a percentage between 70 and 98
    return Math.round(70 + similarity * 28);
  }
}
