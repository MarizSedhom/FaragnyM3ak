// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-series',
//   imports: [],
//   templateUrl: './series.component.html',
//   styleUrl: './series.component.scss'
// })
// export class SeriesComponent {

// }

// movies.component.ts
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeriesCardComponent } from './series-card/series-card.component';
import { Series } from '../../shared/models/series.model';
// import { Series } from '../../shared/models/series.model';
@Component({
  selector: 'app-series',
  imports: [CommonModule, SeriesCardComponent, FormsModule],
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})

export class SeriesComponent {
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
    // Add more movies as needed
  ];
  searchQuery: string = '';
  filteredSeries: Series[] = [];

  constructor() {
    this.filteredSeries = [...this.series]; // Initializing with all series
  }

  filterSeries() {
    if (!this.searchQuery) {
      this.filteredSeries = [...this.series];
      return;
    }

    this.filteredSeries = this.series.filter(series => 
      series.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}


