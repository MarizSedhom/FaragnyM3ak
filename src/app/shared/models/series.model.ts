export interface Series {
  id: number;
  title: string;
  imageUrl: string;
  backdropUrl?: string;
  rating: number;
  ratingCount: number;
  seasons: number | null;
  episodes: number | null;
  description: string;
  hasSub: boolean;
  hasDub: boolean;

  // Additional fields useful for series preview
  genres?: string[];
  status?: string;
  firstAirDate?: string;
  lastAirDate?: string;
  networks?: string[];
  creators?: string[];
  popularity?: number;
  reviews?: Review[];
}
export interface Review {
  user: string;
  stars: number;
  comment: string;
  date: string;
}

export interface SeriesCast {
  id: number;
  name: string;
  character: string;
  profilePath: string;
}

export interface SeriesTrailer {
  key: string;
  site: string;
  name: string;
  type: string;
}

   export interface SeriesResponse {
      page : number
      results : Series[];
      total_pages : number;
      total_results : number;
    }