export interface Movie {
    id: number;
    title: string;
    imageUrl: string;
    rating: number;
    ratingCount: number;
    duration: number; // Duration in minutes
    description: string;
    hasSub: boolean;
    hasDub: boolean;
    genre_ids?: number[];
    trailerKey?: string; // YouTube video key for the trailer
  }

// Additional interfaces for the preview component
export interface MovieDetail extends Movie {
  backdropUrl?: string;
  releaseDate?: string;
  genres?: string[];
  director?: string;
  cast?: string[];
  reviews?: Review[];
  related?: number[];
}

export interface Review {
  user: string;
  stars: number;
  comment: string;
  date: string;
}

export interface RelatedMovie {
  id: number;
  title: string;
  imageUrl: string;
  matchPercentage: number;
}
  /*
 // src/app/models/movie.model.ts
export interface Movie {
  id: number;//string;
  title: string;
  genres: string[];
  duration: number;//string;
  releaseDate: string;
  rating: number;//string;
  imdbRating: number;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  quality: string;
  director: string;
  cast: string[];
  languages: string[];
  reviews: Review[];
  related: string[];
  //////////El 7agat el ziada rabena istor hangebha mnen/////////////
  description: string;
  hasSub: boolean;
  hasDub: boolean;
  ratingCount: number;
}

export interface Review {
  user: string;
  stars: number;
  comment: string;
  date: string;
}

export interface RelatedMovie {
  id: string;
  title: string;
  posterUrl: string;
  matchPercentage: number;
}
*/
