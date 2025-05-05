// movies.component.ts
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Movie } from '../../shared/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
@Component({
  standalone: true,
  selector: 'app-movies',
  imports: [CommonModule, MovieCardComponent, FormsModule],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})

export class MoviesComponent {

  movies: Movie[] = [
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
  searchQuery: string = '';
  filteredMovies: Movie[] = [];

  constructor(private route: Router) {
    this.filteredMovies = [...this.movies]; // Initializing with all movies
  }

  filterMovies() {
    if (!this.searchQuery) {
      this.filteredMovies = [...this.movies];
      return;
    }

    this.filteredMovies = this.movies.filter(movie => 
      movie.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

}


