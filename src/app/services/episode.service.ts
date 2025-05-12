import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Episode {
  title: string;
  thumbnail: string;
  duration: number;
  watchID: string;
}

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
  private apiUrl = '/api'; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  getEpisodes(): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.apiUrl}/episodes`);
  }

  getEpisode(watchId: string): Observable<Episode> {
    return this.http.get<Episode>(`${this.apiUrl}/episodes/${watchId}`);
  }
} 