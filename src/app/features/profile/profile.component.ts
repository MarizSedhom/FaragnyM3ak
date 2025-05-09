// import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, QueryList, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { MediaItem, MediaListType } from './models/media.model';
import { MOCK_MEDIA } from './data/mock-media';
import { MediaPanelComponent } from './components/media-panel/media-panel.component';
import { MediaCardComponent } from './components/media-card/media-card.component';
import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-profile',
  standalone:true,
  imports: [CommonModule,MediaPanelComponent, DragDropModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  mediaItems: MediaItem[] = MOCK_MEDIA;

  get watchList():MediaItem[]{
    return this.mediaItems.filter(item => !item.isFavorite);
  }

  get favorites():MediaItem[]{
    return this.mediaItems.filter(item => item.isFavorite);
  }
  get continueWatching(): MediaItem[]{
    return this.mediaItems
      .filter(item => {
        if(item.type === 'movie'){
          return (item.progress || 0) > 1 && (item.progress || 0) < 100;
        }

        if(item.type === 'series'){
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

  handleFavoriteToggle(mediaId:string){
    this.mediaItems = this.mediaItems.map(item => {
      if(item.id === mediaId){
        return {...item, isFavorite: !item.isFavorite};
      }
      return item;
    });

    this.mediaItems = [...this.mediaItems];
  }

  handleWatchedToggle(mediaId: string){
    this.mediaItems = this.mediaItems.map(item => {
      if(item.id === mediaId && item.type === 'movie'){
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
  }){
    this.mediaItems = this.mediaItems.map(item => {
      if(item.id !== event.mediaId || item.type !== 'series') return item;

      return {
        ...item,
        seasons: item.seasons.map(season => ({
          ...season,
          episodes: season.episodes.map(episode => 
            episode.id === event.episodeId ? {...episode, watched: !episode.watched} : episode
          )
        }))
      };
    });
  }

  //To manage drop functionality
  onDrop(event: CdkDragDrop<MediaItem[]>){
    if(event.previousContainer === event.container){
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }else{
     
      const draggedItem = event.item.data;

      const originalItemIndex = this.mediaItems.findIndex(item => item.id === draggedItem.id);

      if(originalItemIndex > -1){
        this.mediaItems[originalItemIndex].isFavorite = event.container.id === 'favorites';
        
        this.mediaItems = [...this.mediaItems];
      }else{
        console.error('Dragged item not found in main Array');
      }
    }
  }

  getStarRating(rating?: number):string{
    if(rating == null) return '☆'.repeat(5);

    const fullStars = Math.round(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  }

  getCurrentSeason(media: MediaItem): number{
    if(media.type !== 'series') return 0;

    let currentSeason = 1;

    for(let i = media.seasons.length - 1; i >= 0; i--){
      const season = media.seasons[i];

      const hasPartialEpisode = season.episodes.some(e => e.progress > 0 && e.progress < 100);

      const unwatchedEpisode = season.episodes.some(e => !e.watched);

      if(hasPartialEpisode || unwatchedEpisode){
        currentSeason = season.seasonNumber;
        break;
      }
    }

    return currentSeason || 1;
  }

  getCurrentEpisode(media: MediaItem): number{
    if(media.type !== 'series') return 0;

    for (const season of media.seasons){
      const episode = season.episodes.find(e => e.progress > 0 && e.progress < 100);
      if(episode) return episode.episodeNumber;
    }

    return 1;
  }

  getProgress(media: MediaItem): number{
    if(media.type === 'movie'){
      return media.progress;
    }

    for( const season of media.seasons){
      const episode = season.episodes.find(e => e.progress > 0 && e.progress< 100);
      if(episode) return episode.progress;
    }

    return 0;
  }

  getTimeLeft(media: MediaItem): number{
    if(media.type === 'movie'){
      return media.timeLeft;
    }

    for( const season of media.seasons){
      const episode = season.episodes.find(e => e.progress > 0 && e.progress< 100);
      if(episode) return episode.timeLeft;
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

    const scrollAmount = this.calculateScrollAmount(section, direction);
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  private getScrollContainer(section: string): HTMLElement | null {
    return {
      'continue': this.continueScroll?.nativeElement,
      'watchlist': this.watchlistScroll?.nativeElement,
      'favorites': this.favoritesScroll?.nativeElement,
    }[section] || null;
  }

  private calculateScrollAmount(section: string, direction: number): number {
    const CARD_WIDTH = 200; // Match your card width
    const CARD_GAP = 24; // Match your gap size
    
    if (section === 'continue') {
      // Original pixel-based scroll for Continue Watching
      return 300 * direction;
    }
    
    // Scroll 4 cards at a time for Watchlist/Favorites
    // return (CARD_WIDTH + CARD_GAP) * 4 * direction;
    return 300 * direction;

  }
}



