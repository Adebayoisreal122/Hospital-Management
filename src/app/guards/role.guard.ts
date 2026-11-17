import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export type UserRole = 'admin' | 'doctor' | 'patient';

/**
 * Lets a user into a route only if they are logged in AS THAT ROLE.
 * Login stores `authToken` + `authRole`; logout removes both.
 *
 * Note: this is a UX guard, not security. A user can edit localStorage,
 * so the PHP endpoints must (and do) validate the token on every request.
 */
export const roleGuard = (role: UserRole): CanActivateFn => () => {
  const router = inject(Router);
  const loggedIn =
    !!localStorage.getItem('authToken') &&
    localStorage.getItem('authRole') === role;

  return loggedIn ? true : router.createUrlTree(['/login']);
};
