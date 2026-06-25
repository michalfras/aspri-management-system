import { CanActivateFn, Router } from '@angular/router';
import { AccessService } from '../access.service';
import { inject } from '@angular/core';

export const accessGuard: CanActivateFn = () => {
  const accessService = inject(AccessService);
  const router = inject(Router);

  const token = accessService.getTokenFromUrl();

  if (accessService.isGuestToken(token)) return true;
  if (accessService.isOwnerToken(token)) return true;

  const activeAccess = localStorage.getItem('accessType');

  if (activeAccess === 'guest') {
    const timeLeft = accessService.getRemainingAccessTime();
    if (timeLeft <= 0) {
      return router.createUrlTree(['/access']);
    }
    return true;
  }

  if (activeAccess === 'owner') return true;

  return router.createUrlTree(['/access']);
};
