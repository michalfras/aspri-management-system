import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const firstVisitGuard: CanActivateFn = () => {
  const visited = localStorage.getItem('visited');

  if (!visited) {
    return inject(Router).createUrlTree(['welcome']);
  }

  return true;
};
