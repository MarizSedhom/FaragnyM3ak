import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Movie } from '../../shared/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { Series } from '../../shared/models/series.model';
import { SeriesCardComponent } from '../../shared/components/series-card/series-card.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, MovieCardComponent, SeriesCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  images: { src: string, alt: string }[] = [];

  movies: Movie[] = [
    {
      id: 1,
      title: 'A Working Man',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRhNaBoUoJW04asIrQNOs_16o6OmlQX1UK3A&s',
      rating: 6.4,
      ratingCount: 12,
      duration: 115,
      description: 'A story of a resilient man navigating daily hardships.',
      hasSub: true,
      hasDub: false
    },
    {
      id: 2,
      title: 'A Minecraft Movie',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPVuWsMQT92jS_NGW6Coeigjwev5krp0k9UWWOAshvqJIONTE2m6h5QEsP0SClvj1P7VU&usqp=CAU',
      rating: 6.2,
      ratingCount: 9,
      duration: 98,
      description: 'An adventure through blocky lands.',
      hasSub: false,
      hasDub: true
    },
    {
      id: 3,
      title: 'Sinners',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ35ZtMalXPpw-jD69t4BHLI3YEIFZglkyw&s',
      rating: 7.6,
      ratingCount: 18,
      duration: 130,
      description: 'A thrilling drama of choices and consequences.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 4,
      title: 'The Accountant 2',
      imageUrl: 'https://lh5.googleusercontent.com/proxy/xwrF8VXJW_WT31LSJsGUD71tHYweNlWavG7vb5vpwfvOofzjDxGe6ARUa9SUrUESGo2xeIH18bt101a9SJvpMiiAzDqUd8QQFnTvEYntvGQ',
      rating: 7.3,
      ratingCount: 22,
      duration: 125,
      description: 'Back with numbers and bullets.',
      hasSub: true,
      hasDub: false
    },
    {
      id: 5,
      title: 'Death of a Unicorn',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpNNcXDGBcahjV2YWY7BMrC64o41PRbhK7jQ&s',
      rating: 6.1,
      ratingCount: 7,
      duration: 110,
      description: 'A bizarre mystery with fantastical elements.',
      hasSub: false,
      hasDub: false
    },
    {
      id: 6,
      title: 'Thunderbolts*',
      imageUrl: 'https://cdn.marvel.com/content/1x/thunderboltsposter.jpeg',
      rating: 7.6,
      ratingCount: 30,
      duration: 138,
      description: 'Marvel’s anti-hero squad is on a mission.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 7,
      title: 'Ghostbusters: Ice Age',
      imageUrl: 'https://external-preview.redd.it/new-posters-for-ghostbusters-frozen-empire-v0-I8FDRoQNStr7L875KvKSjyYsGCkALTlZVa3YaZIvim8.jpg?auto=webp&s=d7904fb9592c2690fda013a20f8d5d10895274ca',
      rating: 6.7,
      ratingCount: 15,
      duration: 102,
      description: 'The ghosts return — colder than ever.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 8,
      title: 'Deadpool & Wolverine',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BZTk5ODY0MmQtMzA3Ni00NGY1LThiYzItZThiNjFiNDM4MTM3XkEyXkFqcGc@._V1_.jpg',
      rating: 8.1,
      ratingCount: 40,
      duration: 140,
      description: 'Two wild heroes in one epic crossover.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 9,
      title: 'Kingdom of the Planet of the Apes',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BZDRlZTc3YTItOTk3Yi00NmU4LWFiOGUtNjgwMDZjNjIzNTU1XkEyXkFqcGc@._V1_.jpg',
      rating: 7.2,
      ratingCount: 19,
      duration: 135,
      description: 'A new dawn in ape civilization.',
      hasSub: true,
      hasDub: false
    },
    {
      id: 10,
      title: 'Furiosa: A Mad Max Saga',
      imageUrl: 'https://c8.alamy.com/comp/2TCFCPB/furiosa-anya-taylor-joy-poster-2TCFCPB.jpg',
      rating: 7.8,
      ratingCount: 25,
      duration: 132,
      description: 'A fierce warrior’s rise in the wasteland.',
      hasSub: true,
      hasDub: true
    }
  ];

  series: Series[] = [
    {
      id: 1,
      title: 'The Shawshank Redemption',
      imageUrl: 'https://m.media-amazon.com/images/I/61t9ie31jgL._AC_UF894,1000_QL80_.jpg',
      rating: 4.9,
      ratingCount: 250.7,
      seasons: 4,
      episodes: 87,
      description: 'In a world where humanity lives within cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 2,
      title: 'Demon Slayer',
      imageUrl: 'https://m.media-amazon.com/images/I/71V5F1sj-mL._AC_UF894,1000_QL80_.jpg',
      rating: 4.8,
      ratingCount: 189.2,
      seasons: 3,
      episodes: 44,
      description: 'A young boy who sells coal to support his family finds his world turned upside down when his family is slaughtered by demons. His sister Nezuko is the sole survivor, but she has been transformed into a demon herself.',
      hasSub: true,
      hasDub: false
    },
    {
      id: 3,
      title: 'Jujutsu Kaisen',
      imageUrl: 'https://m.media-amazon.com/images/I/81s+jxE5KEL._AC_SL1500_.jpg',
      rating: 4.9,
      ratingCount: 205.4,
      seasons: 2,
      episodes: 48,
      description: 'Yuji Itadori swallows a cursed talisman and becomes host to a powerful curse. To save his friends from this curse, he joins Tokyo Jujutsu High as a first-year student.',
      hasSub: false,
      hasDub: true
    },
    {
      id: 4,
      title: 'My Hero Academia',
      imageUrl: 'https://m.media-amazon.com/images/I/71sNBqs5qWL._AC_SL1001_.jpg',
      rating: 4.7,
      ratingCount: 221.9,
      seasons: 6,
      episodes: 138,
      description: 'In a world where people with superpowers are the norm, Izuku Midoriya dreams of becoming a hero despite being born without any powers.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 5,
      title: 'Death Note',
      imageUrl: 'https://m.media-amazon.com/images/I/716ASj7z2GL._AC_SL1000_.jpg',
      rating: 4.9,
      ratingCount: 312.5,
      seasons: 1,
      episodes: 37,
      description: 'A high school student discovers a supernatural notebook that allows him to kill anyone by writing the victim\'s name while picturing their face.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 6,
      title: 'One Punch Man',
      imageUrl: 'https://www.grindstore.com/cdn/shop/files/118796-front.jpg?v=1710948106',
      rating: 4.8,
      ratingCount: 198.3,
      seasons: 2,
      episodes: 24,
      description: 'Saitama is a hero who can defeat any opponent with a single punch but seeks to find a worthy opponent after growing bored by a lack of challenge.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 7,
      title: 'Naruto: Shippuden',
      imageUrl: 'https://images-cdn.ubuy.co.id/65da696fc3c24c2e08576864-trends-international-naruto-shippuden.jpg',
      rating: 4.8,
      ratingCount: 425.1,
      seasons: 21,
      episodes: 500,
      description: 'Naruto Uzumaki, now a teenager, continues his quest to become Hokage while facing powerful enemies and uncovering dark secrets about his past.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 8,
      title: 'Tokyo Revengers',
      imageUrl: 'https://cdn.europosters.eu/image/1300/207481.jpg',
      rating: 4.7,
      ratingCount: 156.8,
      seasons: 2,
      episodes: 37,
      description: 'Takemichi Hanagaki discovers he can time-leap to his middle school years and attempts to change the future by saving his ex-girlfriend.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 9,
      title: 'Chainsaw Man',
      imageUrl: 'https://m.media-amazon.com/images/I/71DOGFSR6bL._AC_SL1200_.jpg',
      rating: 4.9,
      ratingCount: 178.6,
      seasons: 1,
      episodes: 12,
      description: 'Denji merges with his pet devil Pochita and becomes Chainsaw Man, a being with the power to transform parts of his body into chainsaws.',
      hasSub: true,
      hasDub: true
    },
    {
      id: 10,
      title: 'Spy x Family',
      imageUrl: 'https://posterwa.com/cdn/shop/files/A3posters.png?v=1734498482',
      rating: 4.9,
      ratingCount: 167.3,
      seasons: 2,
      episodes: 25,
      description: 'A spy forms a fake family to infiltrate an elite school, unaware that his "wife" is an assassin and his "daughter" is a telepath.',
      hasSub: true,
      hasDub: true
    }
  
  ];

  searchQuery: string = '';
  filteredMovies: Movie[] = [];
  filteredSeries: Series[] = [];
  movieGroups: Movie[][] = [];
  seriesGroups: Series[][] = [];
  currentMovieGroup = 0;
  currentSeriesGroup = 0;


  ngOnInit(): void {
    this.loadCarouselImages();
    this.filteredMovies = [...this.movies]; 
    this.filteredSeries = [...this.series]; 
    this.groupMovies();    
    this.groupSeries();                 
  }
  

  loadCarouselImages(): void {
    this.images = [
      { src: 'https://awesomefriday.ca/2014/05/review-x-men-days-of-future-past/x-men-days-of-future-past-banner/', alt: 'First slide' },
      { src: 'https://lumiere-a.akamaihd.net/v1/images/image_d93db6a1.jpeg?region=0,0,760,328', alt: 'Second slide' },
      { src: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/02/up-movie-poster.jpg', alt: 'Third slide' }
    ];
  }

  filterMovies() 
  {
    if (!this.searchQuery) {
      this.filteredMovies = [...this.movies];
    } else {
      this.filteredMovies = this.movies.filter(movie =>
        movie.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  
    this.currentMovieGroup = 0; 
    this.groupMovies();    
  }

  filterSeries() 
  {
    if (!this.searchQuery) {
      this.filteredSeries = [...this.series];
    } else {
      this.filteredSeries = this.series.filter(series=>
        series.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  
    this.currentSeriesGroup = 0; 
    this.groupMovies();    
  }
  
  
  groupMovies(): void {
    const groupSize = 5;
    this.movieGroups = [];
  
    for (let i = 0; i < this.filteredMovies.length; i += groupSize) {
      this.movieGroups.push(this.filteredMovies.slice(i, i + groupSize));
    }
  }

  groupSeries(): void {
    const groupSize = 5;
    this.seriesGroups = [];
  
    for (let i = 0; i < this.filteredSeries.length; i += groupSize) {
      this.seriesGroups.push(this.filteredSeries.slice(i, i + groupSize));
    }
  }
  

  nextMovieGroup(): void 
  {
    if (this.currentMovieGroup < this.movieGroups.length - 1) {
      this.currentMovieGroup++;
    }
  }

  prevMovieGroup(): void 
  {
    if (this.currentMovieGroup > 0) {
      this.currentMovieGroup--;
    }
  }

  nextSeriesGroup(): void {
    if (this.currentSeriesGroup < this.seriesGroups.length - 1) {
      this.currentSeriesGroup++;
    }
  }

  prevSeriesGroup(): void {
    if (this.currentSeriesGroup > 0) {
      this.currentSeriesGroup--;
    }
  }
  
}
