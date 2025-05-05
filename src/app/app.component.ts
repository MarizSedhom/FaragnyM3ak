import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { MoviesComponent } from "./features/movies/movies.component";
import { SeriesComponent } from "./features/series/series.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, MoviesComponent, SeriesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'movie-app';
}
