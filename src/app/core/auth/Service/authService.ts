import { inject, Injectable, signal } from "@angular/core"
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, user } from "@angular/fire/auth"
import { signInWithEmailAndPassword, updateProfile, User } from "firebase/auth"
import { BehaviorSubject, from, Observable } from "rxjs"
// interface UserInterface {
//     email: string,
//     password: string
// }
@Injectable({ providedIn: 'root' })

export class AuthService {
    firebaseAuth = inject(Auth)
    user$ = user(this.firebaseAuth)
    currentUserSignal = signal<User | null | undefined>(undefined)
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    constructor(private auth: Auth) {
        // Firebase listener for login/logout
        onAuthStateChanged(this.auth, user => this.currentUserSubject.next(user));
    }

    // Observable for components to subscribe to
    get currentUser$(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }

    isAuthenticated(): boolean {
        return this.auth.currentUser !== null;
    }

    logout(): Promise<void> {
        return this.auth.signOut();
    }

    register(email: string, password: string, username: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
            .then(response => updateProfile(response.user, { displayName: username }));

        return from(promise);
    }

    login(email: string, password: string): Observable<void> {
        const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
            .then(() => { })
        return from(promise);
    }

}


