import { Review } from '../services/user-lists.service';
import { Movie } from '../../../shared/models/movie.model';
import { Series } from '../../../shared/models/series.model';

export interface UserMovieLists {
  favorites: Movie[];
  watchlist: Movie[];
  tracking: Movie[];
  reviews: Review[];
}

export interface UserSeriesLists {
  favorites: Series[];
  watchlist: Series[];
  tracking: Series[];
  reviews: Review[];
}

export interface UserLists {
  movies: UserMovieLists;
  series: UserSeriesLists;
} 