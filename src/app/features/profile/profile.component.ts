import { Component } from '@angular/core';
import { UserListsService } from './services/user-lists.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(private userListsService: UserListsService) {}

  // Add a movie to favorites
  addMovieToFavorites(movieId: string) {
    this.userListsService.addMovieToFavorites(movieId).subscribe();
  }

  // Add a review
  addMovieReview(movieId: string, review: { rating: number; comment: string }) {
    this.userListsService.addMovieReview(movieId, review).subscribe();
  }

  // Get all user lists
  getUserLists() {
    this.userListsService.getUserLists().subscribe(lists => {
      const { movies, series } = lists;
      // Handle the lists data
    });
  }
}
