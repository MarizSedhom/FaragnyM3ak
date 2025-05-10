import { Component, QueryList, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { MediaItem, MediaListType } from './models/media.model';
import { MOCK_MEDIA } from './data/mock-media';
import { MediaPanelComponent } from './components/media-panel/media-panel.component';
// import { MediaCardComponent } from './components/media-card/media-card.component';
import { CdkDragDrop, CdkDragPlaceholder, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import { UserListsService } from './services/user-lists.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MediaPanelComponent, DragDropModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  // Pagination for each section
  currentContinueIndex: number = 0;
  currentWatchlistIndex: number = 0;
  currentFavoritesIndex: number = 0;
  
  // Number of items to display per page
  readonly itemsPerPage: number = 4;
  readonly scrollAmount: number = 300;

  mediaItems: MediaItem[] = MOCK_MEDIA;

  constructor(private userListsService: UserListsService) {}

  // Pagination controls for Continue Watching
  prevContinue() {
    if (this.currentContinueIndex > 0) {
      this.currentContinueIndex--;
      this.scrollSection('continue', -1);
    }
  }

  nextContinue() {
    const maxItems = this.continueWatching.length;
    const maxPages = Math.ceil(maxItems / this.itemsPerPage);
    
    if (this.currentContinueIndex < maxPages - 1) {
      this.currentContinueIndex++;
      this.scrollSection('continue', 1);
    }
  }

  // Pagination controls for Watchlist
  prevWatchlist() {
    if (this.currentWatchlistIndex > 0) {
      this.currentWatchlistIndex--;
      this.scrollSection('watchlist', -1);
    }
  }

  nextWatchlist() {
    const maxItems = this.watchList.length;
    const maxPages = Math.ceil(maxItems / this.itemsPerPage);
    
    if (this.currentWatchlistIndex < maxPages - 1) {
      this.currentWatchlistIndex++;
      this.scrollSection('watchlist', 1);
    }
  }

  // Pagination controls for Favorites
  prevFavorites() {
    if (this.currentFavoritesIndex > 0) {
      this.currentFavoritesIndex--;
      this.scrollSection('favorites', -1);
    }
  }

  nextFavorites() {
    const maxItems = this.favorites.length;
    const maxPages = Math.ceil(maxItems / this.itemsPerPage);
    
    if (this.currentFavoritesIndex < maxPages - 1) {
      this.currentFavoritesIndex++;
      this.scrollSection('favorites', 1);
    }
  }

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

  get watchList(): MediaItem[] {
    return this.mediaItems.filter(item => !item.isFavorite);
  }

  get favorites(): MediaItem[] {
    return this.mediaItems.filter(item => item.isFavorite);
  }
  
  get continueWatching(): MediaItem[] {
    return this.mediaItems
      .filter(item => {
        if (item.type === 'movie') {
          return (item.progress || 0) > 1 && (item.progress || 0) < 100;
        }

        if (item.type === 'series') {
          return item.seasons.some(s =>
            s.episodes.some(e =>
              e.progress > 0 && e.progress < 100
            )
          );
        }
        return false;
      })
      .sort((a, b) => {
        const dateCompare = (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0);
        return dateCompare;
      });
  }

  handleFavoriteToggle(mediaId: string) {
    this.mediaItems = this.mediaItems.map(item => {
      if (item.id === mediaId) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });

    this.mediaItems = [...this.mediaItems];
  }

  handleWatchedToggle(mediaId: string) {
    this.mediaItems = this.mediaItems.map(item => {
      if (item.id === mediaId && item.type === 'movie') {
        return {
          ...item,
          watched: !item.watched,
          progress: item.watched ? 100 : item.progress,
          timeLeft: item.watched ? 0 : item.timeLeft
        };
      }
      return item;
    })
  }

  handleEpisodeToggle(event: {
    mediaId: string,
    seasonNumber?: number,
    episodeId?: string
  }) {
    this.mediaItems = this.mediaItems.map(item => {
      if (item.id !== event.mediaId || item.type !== 'series') return item;

      return {
        ...item,
        seasons: item.seasons.map(season => ({
          ...season,
          episodes: season.episodes.map(episode =>
            episode.id === event.episodeId ? { ...episode, watched: !episode.watched } : episode
          )
        }))
      };
    });
  }

  //To manage drop functionality
  onDrop(event: CdkDragDrop<MediaItem[]>) {
    if (event.previousContainer === event.container) {
      // Same container - just reorder
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Different container - transfer the item AND update favorite status
      const draggedItem = event.item.data;
      const originalItemIndex = this.mediaItems.findIndex(item => item.id === draggedItem.id);
  
      if (originalItemIndex > -1) {
        // Update favorite status based on container ID
        this.mediaItems[originalItemIndex].isFavorite = event.container.id === 'favorites';
        
        // Update the list to reflect changes
        this.mediaItems = [...this.mediaItems];
        
        // If you want to also move the item visually in the destination container
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        console.error('Dragged item not found in main Array');
      }
    }
  }
  getDragConstraints() {
    return {
      width: 200,  // fixed width for all drag operations
      height: 350  // fixed height for all drag operations
    };
  }
  getStarRating(rating?: number): string {
    if (rating == null) return '☆'.repeat(5);

    const fullStars = Math.round(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  }

  getCurrentSeason(media: MediaItem): number {
    if (media.type !== 'series') return 0;

    let currentSeason = 1;

    for (let i = media.seasons.length - 1; i >= 0; i--) {
      const season = media.seasons[i];

      const hasPartialEpisode = season.episodes.some(e => e.progress > 0 && e.progress < 100);

      const unwatchedEpisode = season.episodes.some(e => !e.watched);

      if (hasPartialEpisode || unwatchedEpisode) {
        currentSeason = season.seasonNumber;
        break;
      }
    }

    return currentSeason || 1;
  }

  getCurrentEpisode(media: MediaItem): number {
    if (media.type !== 'series') return 0;

    for (const season of media.seasons) {
      const episode = season.episodes.find(e => e.progress > 0 && e.progress < 100);
      if (episode) return episode.episodeNumber;
    }

    return 1;
  }

  getProgress(media: MediaItem): number {
    if (media.type === 'movie') {
      return media.progress;
    }

    for (const season of media.seasons) {
      const episode = season.episodes.find(e => e.progress > 0 && e.progress < 100);
      if (episode) return episode.progress;
    }

    return 0;
  }

  getTimeLeft(media: MediaItem): number {
    if (media.type === 'movie') {
      return media.timeLeft;
    }

    for (const season of media.seasons) {
      const episode = season.episodes.find(e => e.progress > 0 && e.progress < 100);
      if (episode) return episode.timeLeft;
    }

    return 0;
  }

  // Scrolling Section
  @ViewChild('continueScroll') continueScroll!: ElementRef;
  @ViewChild('watchlistScroll') watchlistScroll!: ElementRef;
  @ViewChild('favoritesScroll') favoritesScroll!: ElementRef;

  scrollSection(section: 'continue' | 'watchlist' | 'favorites', direction: number) {
    const container = this.getScrollContainer(section);
    if (!container) return;

    const scrollAmount = this.scrollAmount * direction;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  private getScrollContainer(section: string): HTMLElement | null {
    return {
      'continue': this.continueScroll?.nativeElement,
      'watchlist': this.watchlistScroll?.nativeElement,
      'favorites': this.favoritesScroll?.nativeElement,
    }[section] || null;
  }

  // Helper functions for pagination buttons
  canGoBack(section: 'continue' | 'watchlist' | 'favorites'): boolean {
    switch (section) {
      case 'continue': return this.currentContinueIndex > 0;
      case 'watchlist': return this.currentWatchlistIndex > 0;
      case 'favorites': return this.currentFavoritesIndex > 0;
      default: return false;
    }
  }

  canGoForward(section: 'continue' | 'watchlist' | 'favorites'): boolean {
    let maxPages = 0;
    let currentIndex = 0;
    
    switch (section) {
      case 'continue':
        maxPages = Math.ceil(this.continueWatching.length / this.itemsPerPage);
        currentIndex = this.currentContinueIndex;
        break;
      case 'watchlist':
        maxPages = Math.ceil(this.watchList.length / this.itemsPerPage);
        currentIndex = this.currentWatchlistIndex;
        break;
      case 'favorites':
        maxPages = Math.ceil(this.favorites.length / this.itemsPerPage);
        currentIndex = this.currentFavoritesIndex;
        break;
    }
    
    return currentIndex < maxPages - 1;
  }
}