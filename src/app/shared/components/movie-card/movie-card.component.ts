// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-movie-card',
//   imports: [],
//   templateUrl: './movie-card.component.html',
//   styleUrl: './movie-card.component.scss'
// })
// export class MovieCardComponent 
// {
//   topMovies: { title: string; poster: string; rating: number; year: number }[] = [];
//   movieGroups: { title: string; poster: string; rating: number; year: number }[][] = [];
//   currentGroup = 0;

//   ngOnInit(): void {
//     this.loadTopMovies();
//   }


//   loadTopMovies(): void {
//     this.topMovies = [
//       { title: 'A Working Man', poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRhNaBoUoJW04asIrQNOs_16o6OmlQX1UK3A&s', rating: 6.4, year: 2025 },
//       { title: 'A Minecraft Movie', poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPVuWsMQT92jS_NGW6Coeigjwev5krp0k9UWWOAshvqJIONTE2m6h5QEsP0SClvj1P7VU&usqp=CAU', rating: 6.2, year: 2025 },
//       { title: 'Sinners', poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ35ZtMalXPpw-jD69t4BHLI3YEIFZglkyw&s', rating: 7.6, year: 2025 },
//       { title: 'The Accountant 2', poster: 'https://lh5.googleusercontent.com/proxy/xwrF8VXJW_WT31LSJsGUD71tHYweNlWavG7vb5vpwfvOofzjDxGe6ARUa9SUrUESGo2xeIH18bt101a9SJvpMiiAzDqUd8QQFnTvEYntvGQ', rating: 7.3, year: 2025 },
//       { title: 'Death of a Unicorn', poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpNNcXDGBcahjV2YWY7BMrC64o41PRbhK7jQ&s', rating: 6.1, year: 2025 },
//       { title: 'Thunderbolts*', poster: 'https://cdn.marvel.com/content/1x/thunderboltsposter.jpeg', rating: 7.6, year: 2025 },
//       { title: 'Ghostbusters: Ice Age', poster: 'https://external-preview.redd.it/new-posters-for-ghostbusters-frozen-empire-v0-I8FDRoQNStr7L875KvKSjyYsGCkALTlZVa3YaZIvim8.jpg?auto=webp&s=d7904fb9592c2690fda013a20f8d5d10895274ca', rating: 6.7, year: 2025 },
//       { title: 'Deadpool & Wolverine', poster: 'https://m.media-amazon.com/images/M/MV5BZTk5ODY0MmQtMzA3Ni00NGY1LThiYzItZThiNjFiNDM4MTM3XkEyXkFqcGc@._V1_.jpg', rating: 8.1, year: 2025 },
//       { title: 'Kingdom of the Planet of the Apes', poster: 'https://m.media-amazon.com/images/M/MV5BZDRlZTc3YTItOTk3Yi00NmU4LWFiOGUtNjgwMDZjNjIzNTU1XkEyXkFqcGc@._V1_.jpg', rating: 7.2, year: 2025 },
//       { title: 'Furiosa: A Mad Max Saga', poster: 'https://c8.alamy.com/comp/2TCFCPB/furiosa-anya-taylor-joy-poster-2TCFCPB.jpg', rating: 7.8, year: 2025 }
//     ];

//     this.groupMovies(5);
//   }

//   groupMovies(size: number): void {
//     this.movieGroups = [];
//     for (let i = 0; i < this.topMovies.length; i += size) {
//       this.movieGroups.push(this.topMovies.slice(i, i + size));
//     }
//     this.currentGroup = 0;
//   }




  

//   formatRating(rating: number): string {
//     return rating.toFixed(1); // Formats to 1 decimal place
//   }
  
//   formatCount(count: number): string {
//     return (count * 1000).toLocaleString(); // Formats with commas
//   }


  
// }

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.model'

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  formatCount(count: number): string {
    return (count * 1000).toLocaleString();
  }
}
