import { Component, Input, Output, EventEmitter, output } from '@angular/core';
import { MediaItem, Season, Episode } from '../../models/media.model';
import { CommonModule } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { TruncatePipe } from '../../truncate.pipe'

@Component({
  selector: 'app-media-card',
  standalone:true,
  imports: [CommonModule, CdkDrag, TruncatePipe],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss'
})
export class MediaCardComponent {
  @Input() media!: MediaItem;
  @Output() favoriteToggled = new EventEmitter<void>();
  @Output() episodeToggled = new EventEmitter<{
    mediaId: string;
    episodes?: Episode[];
    seasonNumber?: number;
    episodeId?: string;
  }>();

  @Output() watchedToggled = new EventEmitter<string>();

  isExpanded = false;
  expandedSeasons: Set<string> = new Set();

  toggleExpanded(){
    this.isExpanded = !this.isExpanded;
    // document.body.style.overflow = this.isExpanded ? 'hidden' : 'auto';
  }

  getSeasonId(season: Season): string {
    return `${this.media.id}-s${season.seasonNumber}`;
  } 
  
  isSeasonWatched(season: Season): boolean{
    return season.episodes.every(e => e.watched);
  }

  isSeasonExpanded(season: Season){
    return this.expandedSeasons.has(this.getSeasonId(season));
  }

  toggleSeasonExpansion(season: Season){
    const seasonId = this.getSeasonId(season);
    if(this.expandedSeasons.has(seasonId)){
      this.expandedSeasons.delete(seasonId);
    }else{
      this.expandedSeasons.add(seasonId);
    }
  }

  toggleSeasonWatched(season: Season){
    const newState = !this.isSeasonWatched(season);
    season.episodes.forEach(e => e.watched = newState);
    this.episodeToggled.emit({ mediaId: this.media.id, 
      episodes: season.episodes});
  }

  toggleEpisodeWatched(season: Season, episode: Episode){
    episode.watched = !episode.watched;
    this.episodeToggled.emit({
      mediaId: this.media.id,
      seasonNumber: season.seasonNumber,
      episodeId: episode.id
    });
  }
  markMovieWatched(){
   if(this.media.type === 'movie'){
    this.media.watched = !this.media.watched;
    if(this.media.watched){
      this.media.progress = 100;
      this.media.timeLeft = 0;
    }
    this.watchedToggled.emit(this.media.id);
   }
  }
  // toggleEpisode(episodeId: string){
  //   this.episodeToggled.emit(episodeId);
  // }

  getStarRating(rating?: number):string{
    if(rating === undefined || rating === null){
      return '☆'.repeat(5);
    } 
    const fullStars = Math.round(Math.min(Math.max(rating, 0), 5));

    return '★'.repeat(fullStars) + '☆'.repeat(Math.max(0, 5 - fullStars));
  }

  formatCount(count: number): string {
    return (count * 1000).toLocaleString(); // Formats with commas
  }
}
