// import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, QueryList, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { MediaItem, MediaListType } from './models/media.model';
import { MOCK_MEDIA } from './data/mock-media';
import { MediaPanelComponent } from './components/media-panel/media-panel.component';
import { MediaCardComponent } from './components/media-card/media-card.component';
import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './truncate.pipe'


@Component({
  selector: 'app-profile',
  standalone:true,
  imports: [CommonModule,MediaPanelComponent, DragDropModule, TruncatePipe],
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
    this.mediaItems = this.mediaItems.map(item =>
      item.id === mediaId ? {...item, isFavorite: !item.isFavorite} : item
    );
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
      // moveItemInArray(
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex
      // );
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
  @ViewChildren('scrollableSection')
  sections!: QueryList<ElementRef>;

  scrollSection(sectionName: string, offset:number)
  {
    const section = this.sections.find(s => 
      s.nativeElement.id === `${sectionName}Section`
    );

    if(section){
      const container = section.nativeElement;
      container.scrollBy({
        left:offset,
        behavior: 'smooth'
      });
    }
  }
}
