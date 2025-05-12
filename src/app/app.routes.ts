import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        // canActivate: [AuthGuard]
    },
    {
        path: 'movie-preview/:id',
        loadComponent: () => import('./features/movie-preview/movie-preview.component').then(m => m.MoviePreviewComponent),
        // canActivate: [AuthGuard]
    },
    {
        path: 'series-preview/:id',
        loadComponent: () => import('./features/series-preview/series-preview.component').then(m => m.SeriesPreviewComponent),
        // canActivate: [AuthGuard]
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component')
            .then(m => m.ProfileComponent)
        // canActivate: [AuthGuard]
    },
    {
        path: 'movie',
        loadComponent: () => import('./features/movies/movies.component').then(m => m.MoviesComponent),
        // canActivate: [AuthGuard]
    },
    {
        path: 'series',
        loadComponent: () => import('./features/series/series.component').then(m => m.SeriesComponent),
        // canActivate: [AuthGuard]
    },
    {
        path: 'watch',
        loadComponent: () => import('./features/watch/watch.component').then(m => m.WatchComponent),
        // canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
        // canActivate: [AuthGuard]
    },
    {
        path: 'search',
        loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent),
        // canActivate: [AuthGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./core/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./core/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'pay',
        loadComponent: () => import('./features/payment/payment.component').then(m => m.PaymentComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./shared/components/error/error.component').then(m => m.ErrorComponent)
    },
];
