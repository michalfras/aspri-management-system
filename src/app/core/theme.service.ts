import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<'dark' | 'light' | 'auto' | null>(null);
  isSystemDark = signal(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  currentBackgroundLogo = computed(() => {
    return this.isDarkMode()
      ? 'url(images/general/aspri-logo-biale.webp)'
      : 'url(images/general/aspri-logo-czarne.webp)';
  });

  constructor() {
    this.loadTheme();
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        this.isSystemDark.set(event.matches);

        if (this.theme() === 'auto') {
          this.setTheme('auto');
        }
      });
  }

  isDarkMode() {
    if (
      this.theme() === 'dark' ||
      (this.theme() === 'auto' && this.isSystemDark())
    ) {
      return true;
    } else return false;
  }
  private loadTheme() {
    const userTheme = localStorage.getItem('theme');
    if (userTheme === 'dark' || userTheme === 'light' || userTheme === 'auto')
      this.setTheme(userTheme);
    return;
  }

  setTheme(userTheme: 'dark' | 'light' | 'auto') {
    this.theme.set(userTheme);
    localStorage.setItem('theme', userTheme);

    if (userTheme === 'dark') {
      document.body.classList.add('dark');
    }
    if (userTheme === 'light') {
      document.body.classList.remove('dark');
    }
    if (userTheme === 'auto') {
      const userPrefers = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      if (userPrefers) document.body.classList.add('dark');
      else document.body.classList.remove('dark');
    }
  }
}
