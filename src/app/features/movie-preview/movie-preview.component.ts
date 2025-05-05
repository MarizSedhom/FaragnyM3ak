import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieCardComponent } from "../../shared/components/movie-card/movie-card.component";
import { Movie } from '../../shared/models/movie.model';

@Component({
  selector: 'app-movie-preview',
  imports: [CommonModule, MovieCardComponent],
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
  
  help: Movie[] = [
    {
      id: 1,
      title: 'The Shawshank Redemption',
      imageUrl: 'https://cdn.bizzmedia.ca/media/5c232e34f86e85de5f613f9e816e0270.jpg/400/584',
      rating: 4.9,
      ratingCount: 250.7,
      duration: 142, // 142 minutes
      description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 2,
      title: 'The Godfather',
      imageUrl: 'https://m.media-amazon.com/images/I/61k7Mx2IjzL._AC_UF894,1000_QL80_.jpg',
      rating: 4.8,
      ratingCount: 189.2,
      duration: 175, // 175 minutes
      description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 3,
      title: 'The Dark Knight',
      imageUrl: 'https://m.media-amazon.com/images/I/51rf820GM-L._AC_SL1050_.jpg',
      rating: 4.7,
      ratingCount: 234.5,
      duration: 152, // 152 minutes
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      hasSub: true,
      hasDub: false
    },
    {
      id: 4,
      title: 'Pulp Fiction',
      imageUrl: 'https://i.ebayimg.com/00/s/MTYwMFgxMDcx/z/bLYAAOSwffNjoG1q/$_57.JPG?set_id=8800005007',
      rating: 4.6,
      ratingCount: 167.8,
      duration: 154, // 154 minutes
      description: 'The lives of two mob hitmen, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 5,
      title: 'Forrest Gump',
      imageUrl: 'https://m.media-amazon.com/images/I/61gJ0U3mAiL._AC_UF894,1000_QL80_.jpg',
      rating: 4.5,
      ratingCount: 212.1,
      duration: 142, // 142 minutes
      description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold through the perspective of an Alabama man named Forrest Gump.',
      hasSub: true,
      hasDub: false
    },
    {
      id: 6,
      title: 'Inception',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTM0MjUzNjkwMl5BMl5BanBnXkFtZTcwNjY0OTk1Mw@@._V1_.jpg',
      rating: 4.6,
      ratingCount: 198.3,
      duration: 148, // 148 minutes
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given his inverse task of planting an idea into the mind of a C.E.O.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 7,
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      imageUrl: 'https://m.media-amazon.com/images/I/71TZ8BmoZqL._AC_SL1000_.jpg',
      rating: 4.7,
      ratingCount: 221.9,
      duration: 178, // 178 minutes
      description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 8,
      title: 'Fight Club',
      imageUrl: 'https://www.tallengestore.com/cdn/shop/products/Fight_Club_-_Brad_Pitt_-_Soap_-_Hollywood_Cult_Classic_English_Movie_Poster_c927cfc8-3f3a-499e-80b3-6890e2b44e43.jpg?v=1579090339',
      rating: 4.5,
      ratingCount: 175.6,
      duration: 139, // 139 minutes
      description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more.',
      hasSub: true,
      hasDub: false
    },
    {
      id: 9,
      title: 'Spirited Away',
      imageUrl: 'https://m.media-amazon.com/images/I/61ON14PVzoL.jpg',
      rating: 4.8,
      ratingCount: 155.2,
      duration: 125, // 125 minutes
      description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 10,
      title: 'The Matrix',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_.jpg',
      rating: 4.6,
      ratingCount: 188.9,
      duration: 136, // 136 minutes
      description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
      hasSub: true,
      hasDub: true
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
    this.movie = this.movies.find(m => m.id == this.movieId!);

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
