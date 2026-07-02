import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AccessService {
  router = inject(Router);

  private readonly guestToken = 'N7vQ2xLp8MzK4RwHc9';
  private readonly ownerToken = 'Xp84LmQvR2Nz7KtHy5';
  private readonly guestAccessTime = 12 * 60 * 60 * 1000;
  private installMode = false;

  private timeout: any;

  isOwnerToken(token: string | null): boolean {
    return this.ownerToken === token;
  }
  isGuestToken(token: string | null): boolean {
    return this.guestToken === token;
  }
  getRemainingAccessTime() {
    const accessTime = Number(localStorage.getItem('accessTime'));
    return this.guestAccessTime - (Date.now() - accessTime);
  }

  getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    this.installMode = params.get('install') === 'true';

    return params.get('access');
  }

  checkAccess() {
    const token = this.getTokenFromUrl();

    if (token === this.guestToken) {
      localStorage.setItem('accessType', 'guest');
      localStorage.setItem('accessTime', Date.now().toString());
      this.router.navigate(['/home'], { replaceUrl: true });
      this.startGuestAccessTime();
      return;
    }
    if (token === this.ownerToken) {
      localStorage.setItem('accessType', 'owner');
      localStorage.removeItem('accessTime');
      if (this.installMode) {
        localStorage.setItem('visited', 'true');
        this.router.navigate(['/home'], {
          queryParams: {
            access: token,
          },
          replaceUrl: true,
        });
        return;
      }
      this.router.navigate(['/home'], { replaceUrl: true });
      return;
    }
    const activeAccess = localStorage.getItem('accessType');

    if (activeAccess === 'guest') {
      const qrScanTime = Number(localStorage.getItem('accessTime'));
      if (Date.now() - qrScanTime < this.guestAccessTime) {
        this.startGuestAccessTime();
        return;
      }
      localStorage.clear();
      this.router.navigate(['/access'], { replaceUrl: true });
      return;
    }
    if (activeAccess === 'owner') {
      return;
    }
    return;
  }

  startGuestAccessTime() {
    const timeLeft = this.getRemainingAccessTime();
    if (timeLeft <= 0) {
      localStorage.clear();
      this.router.navigate(['/access'], { replaceUrl: true });
      return;
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      localStorage.clear();
      this.router.navigate(['/access'], { replaceUrl: true });
    }, timeLeft);
  }
}
