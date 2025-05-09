interface BaseMedia {
    id: string;
    title: string;
    posterUrl: string;
    description: string;
    genre: string[];
    isFavorite:boolean;
    createdAt: Date;
    lastModified:Date;
    // From Yasser's Model
    rating: number;
    ratingCount: number;
    hasSub: boolean;
    hasDub:boolean;
    
}

// Movie-specific 
export interface Movie extends BaseMedia{
    type: 'movie';
    duration: number;
    releaseYear:number;
    watched: boolean;
    timeLeft: number;
    progress: number;

}

// Series-specific
export interface Series extends BaseMedia{
    type: 'series';
    seasons: Season[];
    totalSeasons: number;
}

// season interface
export interface Season{
    seasonNumber: number;
    releaseYear: number;
    episodes: Episode[];
}

// Episode Interface
export interface Episode{
    id: string;
    episodeNumber: number;
    title:string;
    duration:number;
    watched:boolean;
    //For Continue Watching Progress
    progress: number;
    timeLeft: number;

    // watchedData?: Date;
}

export type MediaItem = Movie | Series;
export type MediaListType = 'watchList' | "favorites";

