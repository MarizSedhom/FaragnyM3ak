import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Service/authService';
import { Router } from '@angular/router';

export const AdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userEmail = authService.getCurrentUserEmail();

  if (userEmail === 'admin@faragnymaak.com') {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
