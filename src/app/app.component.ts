import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { AuthService } from './core/auth/Service/authService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
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

  isFullScreenRoute() {
    const fullScreenRoutes = ['/login', '/register'];
    return fullScreenRoutes.includes(this.router.url);
  }
}
