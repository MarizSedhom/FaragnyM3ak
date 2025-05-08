import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'movies-preview',
        loadChildren: () => import('./features/movie-preview/movie-preview.component').then(m => m.MoviePreviewComponent)
    },
    {
        // path: 'profile',
        // loadChildren: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
        path: 'profile', 
        loadComponent: () => import('./features/profile/profile.component')
                .then(m => m.ProfileComponent)
    },
    {
        path: 'movie',
        loadChildren: () => import('./features/movies/movies.component').then(m => m.MoviesComponent)
    },
    {
        path: 'series',
        loadChildren: () => import('./features/series/series.component').then(m => m.SeriesComponent)
    },
    {
        path: 'services',
        loadChildren: () => import('./services/services/services.component').then(m => m.ServicesComponent)
    },
    {
        path: 'watch',
        loadChildren: () => import('./features/watch/watch.component').then(m => m.WatchComponent)
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
];