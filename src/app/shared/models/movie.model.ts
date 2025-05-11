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
