import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MediaItem } from '../../models/media.model';
import { CommonModule } from '@angular/common';
import { MediaCardComponent } from '../media-card/media-card.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-media-panel',
  standalone:true,
  imports: [CommonModule, MediaCardComponent, DragDropModule],
  templateUrl: './media-panel.component.html',
  styleUrl: './media-panel.component.scss'
})
export class MediaPanelComponent {
  @Input() title: string = '';
  @Input() items: MediaItem[] = [];
  @Output() drop = new EventEmitter<CdkDragDrop<MediaItem[]>>();
  @Output() favoriteToggled = new EventEmitter<string>();
  @Output() episodeToggled = new EventEmitter<{
    mediaId: string;
    seasonNumber?: number;
    episodeId?: string;
  }>()
  @Output() watchedToggled = new EventEmitter<string>();


  trackById(index: number, item: MediaItem): string{
    return item.id;
  }

  onEpisodeToggled(event: {
    mediaId: string;
    seasonNumber?: number;
    episodeId?: string;
  }){
    this.episodeToggled.emit(event);
  }
  
}
