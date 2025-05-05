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
  }