import { inject, Injectable, signal } from "@angular/core"
import { Auth, createUserWithEmailAndPassword, user } from "@angular/fire/auth"
import { signInWithEmailAndPassword, updateCurrentUser, updateProfile } from "firebase/auth"
import { from, Observable } from "rxjs"
interface UserInterface {
    email: string,
    password: string
}
@Injectable({ providedIn: 'root' })

export class AuthService {
    firebaseAuth = inject(Auth)
    user$ = user(this.firebaseAuth)
    currentUserSignal = signal<UserInterface | null | undefined>(undefined)


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