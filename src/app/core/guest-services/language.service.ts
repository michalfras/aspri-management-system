import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translate = inject(TranslateService);

  lang = signal<string>('');
  isWaiterMode = signal<boolean>(false);

  constructor() {
    this.init();
  }

  init() {
    this.translate.addLangs(['pl', 'en', 'ger', 'jpn', 'ukr']);
    this.translate.setFallbackLang('en');
    const userLang = localStorage.getItem('aspri-app-lang');
    if (userLang) {
      this.translate.use(userLang);
      document.documentElement.lang = userLang;
      this.lang.set(userLang);
    } else {
      this.translate.use('pl');
      document.documentElement.lang = 'pl';
      this.lang.set('');
    }
  }
  setLang(lang: string) {
    this.translate.use(lang);
    document.documentElement.lang = lang;
    this.lang.set(lang);
    localStorage.setItem('aspri-app-lang', lang);
  }

  getPolishText(key: string) {
    if (!this.isWaiterMode()) return;

    const currentLang = this.translate.getCurrentLang();
    try {
      this.translate.use('pl');
      const value = this.translate.instant(key);
      return value;
    } finally {
      this.translate.use(currentLang);
    }
  }
}
