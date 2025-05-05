import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService)
  const token = auth.isAuthed;

  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
