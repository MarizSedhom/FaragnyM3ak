import { Injectable, inject } from '@angular/core';
import { Firestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, from, map, of } from 'rxjs';

export interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class UserListsService {
    private firestore = inject(Firestore);
    private auth = inject(Auth);

    // Movies operations
    addMovieToFavorites(movieId: string): Observable<void> {
        return this.updateUserList('movies', 'favorites', movieId, true);
    }

    removeMovieFromFavorites(movieId: string): Observable<void> {
        return this.updateUserList('movies', 'favorites', movieId, false);
    }

    addMovieToWatchlist(movieId: string): Observable<void> {
        return this.updateUserList('movies', 'watchlist', movieId, true);
    }

    removeMovieFromWatchlist(movieId: string): Observable<void> {
        return this.updateUserList('movies', 'watchlist', movieId, false);
    }

    addMovieToTracking(movieId: string): Observable<void> {
        return this.updateUserList('movies', 'tracking', movieId, true);
    }

    removeMovieFromTracking(movieId: string): Observable<void> {
        return this.updateUserList('movies', 'tracking', movieId, false);
    }

    addMovieReview(movieId: string, review: Omit<Review, 'id' | 'createdAt'>): Observable<void> {
        const reviewWithMetadata = {
            ...review,
            id: movieId,
            createdAt: new Date()
        };
        return this.updateUserList('movies', 'reviews', reviewWithMetadata, true);
    }

    // Series operations
    addSeriesToFavorites(seriesId: string): Observable<void> {
        return this.updateUserList('series', 'favorites', seriesId, true);
    }

    removeSeriesFromFavorites(seriesId: string): Observable<void> {
        return this.updateUserList('series', 'favorites', seriesId, false);
    }

    addSeriesToWatchlist(seriesId: string): Observable<void> {
        return this.updateUserList('series', 'watchlist', seriesId, true);
    }

    removeSeriesFromWatchlist(seriesId: string): Observable<void> {
        return this.updateUserList('series', 'watchlist', seriesId, false);
    }

    addSeriesToTracking(seriesId: string): Observable<void> {
        return this.updateUserList('series', 'tracking', seriesId, true);
    }

    removeSeriesFromTracking(seriesId: string): Observable<void> {
        return this.updateUserList('series', 'tracking', seriesId, false);
    }

    addSeriesReview(seriesId: string, review: Omit<Review, 'id' | 'createdAt'>): Observable<void> {
        const reviewWithMetadata = {
            ...review,
            id: seriesId,
            createdAt: new Date()
        };
        return this.updateUserList('series', 'reviews', reviewWithMetadata, true);
    }

    // Get user lists
    getUserLists(): Observable<{
        movies: { favorites: string[], watchlist: string[], tracking: string[], reviews: Review[] },
        series: { favorites: string[], watchlist: string[], tracking: string[], reviews: Review[] }
    }> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        return from(getDoc(doc(this.firestore, 'users', userId))).pipe(
            map(doc => {
                const data = doc.data();
                return {
                    movies: {
                        favorites: data?.['movies']?.['favorites'] || [],
                        watchlist: data?.['movies']?.['watchlist'] || [],
                        tracking: data?.['movies']?.['tracking'] || [],
                        reviews: data?.['movies']?.['reviews'] || []
                    },
                    series: {
                        favorites: data?.['series']?.['favorites'] || [],
                        watchlist: data?.['series']?.['watchlist'] || [],
                        tracking: data?.['series']?.['tracking'] || [],
                        reviews: data?.['series']?.['reviews'] || []
                    }
                };
            })
        );
    }

    // Helper method to update lists
    private updateUserList(
        type: 'movies' | 'series',
        list: 'favorites' | 'watchlist' | 'tracking' | 'reviews',
        item: any,
        add: boolean
    ): Observable<void> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const userRef = doc(this.firestore, 'users', userId);
        const updateOperation = add ? arrayUnion(item) : arrayRemove(item);

        return from(updateDoc(userRef, {
            [`${type}.${list}`]: updateOperation
        }));
    }

    isMovieInFavouriteList(movieId: string): Observable<boolean> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            return of(false);
        }
        const userRef = doc(this.firestore, 'users', userId);
        return from(getDoc(userRef)).pipe(
            map(doc => {
                const data = doc.data();
                const favorites = data?.['movies']?.['favorites'] || [];
                return favorites.includes(movieId);
            })
        );
    }

   isSeriesInFavouriteList(seriesId: string): Observable<boolean> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            return of(false);
        }
        const userRef = doc(this.firestore, 'users', userId);
        return from(getDoc(userRef)).pipe(
            map(doc => {
                const data = doc.data();
                const favorites = data?.['series']?.['favorites'] || [];
                return favorites.includes(seriesId);
            })
        );
    }


    isMovieInWatchlist(movieId: string): Observable<boolean> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            return of(false);
        }
        const userRef = doc(this.firestore, 'users', userId);
        return from(getDoc(userRef)).pipe(
            map(doc => {
                const data = doc.data();
                const favorites = data?.['movies']?.['watchlist'] || [];
                return favorites.includes(movieId);
            })
        );
    }

    isSeriesInWatchlist(seriesId: string): Observable<boolean> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            return of(false);
        }
        const userRef = doc(this.firestore, 'users', userId);
        return from(getDoc(userRef)).pipe(
            map(doc => {
                const data = doc.data();
                const favorites = data?.['series']?.['watchlist'] || [];
                return favorites.includes(seriesId);
            })
        );
    }
}
