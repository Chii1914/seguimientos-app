import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service'; // Adjust the path as needed
import { Router } from '@angular/router';
import { CookieService } from '../cookies/cookie.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const cookieService = inject(CookieService);

  // Extract the 'xvlf' parameter from the URL
  const params = new URLSearchParams(state.url.split('?')[1]);
  const xvlf = params.get('xvlf') ?? '';

  if (xvlf) {
    cookieService.setCookie('xvlf', xvlf, 1);
  }

  const isAuthenticated = await authService.verifySession();

  if (isAuthenticated) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
