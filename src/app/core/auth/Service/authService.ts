import { inject, Injectable, signal } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, user, signInWithEmailAndPassword, updateProfile, User } from "@angular/fire/auth";
import { BehaviorSubject, from, Observable } from "rxjs";
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    firebaseAuth = inject(Auth);
    firestore = inject(Firestore);
    user$ = user(this.firebaseAuth);
    currentUserSignal = signal<User | null | undefined>(undefined);
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    constructor(private auth: Auth, private router: Router) {
        onAuthStateChanged(this.auth, user => this.currentUserSubject.next(user));
    }

    get currentUser$(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }

    isAuthenticated(): boolean {
        return this.auth.currentUser !== null;
    }

    logout(): Promise<void> {
        return this.auth.signOut();
    }

    getCurrentUserEmail(): string | null {
        return this.auth.currentUser?.email ?? null;
    }

    private async createUserData(userId: string, email: string, username: string) {
        const userRef = doc(this.firestore, 'users', userId);

        await setDoc(userRef, {
            profile: {
                email,
                username,
                createdAt: serverTimestamp()
            },
            movies: {
                favorites: [],
                watchlist: [],
                tracking: [],
                reviews: []
            },
            series: {
                favorites: [],
                watchlist: [],
                tracking: [],
                reviews: []
            }
        });
    }

    register(email: string, password: string, username: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
            .then(async response => {
                await updateProfile(response.user, { displayName: username });
                await this.createUserData(response.user.uid, email, username);
            });

        return from(promise);
    }

    login(email: string, password: string): Observable<void> {
        const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
            .then(() => {
                if (email === 'admin@faragnymaak.com') {
                    this.router.navigate(['/admin']);
                } else {
                    this.router.navigate(['/profile']);
                }
            });
        return from(promise);
    }
}
