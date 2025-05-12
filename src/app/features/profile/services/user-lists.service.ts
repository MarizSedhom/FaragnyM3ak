import { Injectable, inject } from '@angular/core';
import { Firestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface UserReview extends Review {
    userId?: string;  // The ID of the user who created the review
    username?: string; // Optional username for display
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

    // Enhanced movie review methods
    addMovieReview(movieId: string, review: { rating: number, comment: string }): Observable<void> {
        const reviewWithMetadata: Review = {
            id: movieId,
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date()
        };
        return this.updateUserList('movies', 'reviews', reviewWithMetadata, true);
    }

    // Get user's review for a specific movie if it exists
    getUserMovieReview(movieId: string): Observable<UserReview | null> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            return of(null);
        }

        return from(getDoc(doc(this.firestore, 'users', userId))).pipe(
            map(doc => {
                const data = doc.data();
                const reviews = data?.['movies']?.['reviews'] || [];
                const foundReview = reviews.find((review: Review) => review.id === movieId);

                if (foundReview) {
                    // Add user information to the review
                    return {
                        ...foundReview,
                        userId: userId,
                        username: this.auth.currentUser?.displayName || 'Anonymous'
                    };
                }
                return null;
            })
        );
    }

    // Method to get all movie reviews for a specific movie
    getAllMovieReviews(movieId: string): Observable<UserReview[]> {
        // Query all users who have reviewed this movie in Firestore
        return from(getDocs(collection(this.firestore, 'users'))).pipe(
            map(snapshot => {
                const allReviews: UserReview[] = [];

                // Iterate through all user documents
                snapshot.forEach(userDoc => {
                    const userData = userDoc.data();
                    const userId = userDoc.id;

                    // Get the user's movie reviews array (if it exists)
                    const movieReviews = userData?.['movies']?.['reviews'] || [];

                    // Find any review for this specific movie
                    const movieReview = movieReviews.find((review: Review) => review.id === movieId);

                    if (movieReview) {
                        // Add to our collection with user info
                        allReviews.push({
                            ...movieReview,
                            userId: userId,
                            username: userData?.['displayName'] || 'User ' + userId.substring(0, 5)
                        });
                    }
                });

                // Sort reviews (newest first)
                return allReviews.sort((a, b) => {
                    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
                    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
                    return dateB.getTime() - dateA.getTime();
                });
            })
        );
    }

    // Update a movie review - FIXED
    updateMovieReview(movieId: string, review: { rating: number, comment: string }): Observable<void> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const userRef = doc(this.firestore, 'users', userId);

        // First get the current user data to find and remove the existing review
        return from(getDoc(userRef)).pipe(
            switchMap(docSnapshot => {
                const data = docSnapshot.data();
                const reviews = data?.['movies']?.['reviews'] || [];

                // Create the updated reviews array by filtering out the old review
                const updatedReviews = reviews.filter((r: Review) => r.id !== movieId);

                // Add the new review
                const newReview: Review = {
                    id: movieId,
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: new Date()
                };
                updatedReviews.push(newReview);

                // Update the entire reviews array
                return from(updateDoc(userRef, {
                    'movies.reviews': updatedReviews
                }));
            })
        );
    }

    // Remove a movie review - FIXED
    removeMovieReview(movieId: string): Observable<void> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const userRef = doc(this.firestore, 'users', userId);

        // Get current user data
        return from(getDoc(userRef)).pipe(
            switchMap(docSnapshot => {
                const data = docSnapshot.data();
                const reviews = data?.['movies']?.['reviews'] || [];

                // Filter out the review to delete
                const updatedReviews = reviews.filter((r: Review) => r.id !== movieId);

                // Update with the filtered array
                return from(updateDoc(userRef, {
                    'movies.reviews': updatedReviews
                }));
            })
        );
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

    // Enhanced series review methods
    addSeriesReview(seriesId: string, review: { rating: number, comment: string }): Observable<void> {
        const reviewWithMetadata: Review = {
            id: seriesId,
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date()
        };
        return this.updateUserList('series', 'reviews', reviewWithMetadata, true);
    }

    // Get user's review for a specific series if it exists
    getUserSeriesReview(seriesId: string): Observable<UserReview | null> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            return of(null);
        }

        return from(getDoc(doc(this.firestore, 'users', userId))).pipe(
            map(doc => {
                const data = doc.data();
                const reviews = data?.['series']?.['reviews'] || [];
                const foundReview = reviews.find((review: Review) => review.id === seriesId);

                if (foundReview) {
                    // Add user information to the review
                    return {
                        ...foundReview,
                        userId: userId,
                        username: this.auth.currentUser?.displayName || 'Anonymous'
                    };
                }
                return null;
            })
        );
    }

    // Method to get all series reviews for a specific series
    getAllSeriesReviews(seriesId: string): Observable<UserReview[]> {
        // Query all users who have reviewed this series in Firestore
        return from(getDocs(collection(this.firestore, 'users'))).pipe(
            map(snapshot => {
                const allReviews: UserReview[] = [];

                // Iterate through all user documents
                snapshot.forEach(userDoc => {
                    const userData = userDoc.data();
                    const userId = userDoc.id;

                    // Get the user's series reviews array (if it exists)
                    const seriesReviews = userData?.['series']?.['reviews'] || [];

                    // Find any review for this specific series
                    const seriesReview = seriesReviews.find((review: Review) => review.id === seriesId);

                    if (seriesReview) {
                        // Add to our collection with user info
                        allReviews.push({
                            ...seriesReview,
                            userId: userId,
                            username: userData?.['displayName'] || 'User ' + userId.substring(0, 5)
                        });
                    }
                });

                // Sort reviews (newest first)
                return allReviews.sort((a, b) => {
                    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
                    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
                    return dateB.getTime() - dateA.getTime();
                });
            })
        );
    }

    // Update a series review
    updateSeriesReview(seriesId: string, review: { rating: number, comment: string }): Observable<void> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const userRef = doc(this.firestore, 'users', userId);

        // First get the current user data to find and remove the existing review
        return from(getDoc(userRef)).pipe(
            switchMap(docSnapshot => {
                const data = docSnapshot.data();
                const reviews = data?.['series']?.['reviews'] || [];

                // Create the updated reviews array by filtering out the old review
                const updatedReviews = reviews.filter((r: Review) => r.id !== seriesId);

                // Add the new review
                const newReview: Review = {
                    id: seriesId,
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: new Date()
                };
                updatedReviews.push(newReview);

                // Update the entire reviews array
                return from(updateDoc(userRef, {
                    'series.reviews': updatedReviews
                }));
            })
        );
    }

    // Remove a series review
    removeSeriesReview(seriesId: string): Observable<void> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const userRef = doc(this.firestore, 'users', userId);

        // Get current user data
        return from(getDoc(userRef)).pipe(
            switchMap(docSnapshot => {
                const data = docSnapshot.data();
                const reviews = data?.['series']?.['reviews'] || [];

                // Filter out the review to delete
                const updatedReviews = reviews.filter((r: Review) => r.id !== seriesId);

                // Update with the filtered array
                return from(updateDoc(userRef, {
                    'series.reviews': updatedReviews
                }));
            })
        );
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
                console.log("data",data);
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
