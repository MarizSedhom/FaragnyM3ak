import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { AuthService } from './core/auth/Service/authService';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule, DragDropModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'movie-app';
  authService = inject(AuthService)
  constructor(private router: Router) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user)
        this.authService.currentUserSignal.set(user);
      else
        this.authService.currentUserSignal.set(null);

    })
  }

  isFullScreenRoute(): boolean {
    const currentRoute = this.router.url;
    return currentRoute === '/login' || 
           currentRoute === '/register' || 
           currentRoute === '/pay';
  }
}
