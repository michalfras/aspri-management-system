import { inject, Injectable, signal } from '@angular/core';
import {
  AdminTranslation,
  ProductChoice,
  ProductData,
} from '@models/product-model';
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

  getTranslatedName(product: ProductData) {
    if (product.adminName) {
      return this.getAdminTranslation(product.adminName);
    }
    return this.translate.instant(product.nameKey);
  }
  getTranslatedInfo(product: ProductData) {
    if (product.adminInfo) {
      return this.getAdminTranslation(product.adminInfo);
    }
    if (!product.infoKey) return;
    return this.translate.instant(product.infoKey);
  }
  getTranslatedShortInfo(product: ProductData) {
    if (product.adminShortInfo) {
      return this.getAdminTranslation(product.adminShortInfo);
    }
    if (!product.shortInfoKey) return;
    return this.translate.instant(product.shortInfoKey);
  }
  getTranslatedChoice(choice: ProductChoice) {
    if (choice.adminLabel) {
      return this.getAdminTranslation(choice.adminLabel);
    }
    if (!choice.labelKey) return;
    return this.translate.instant(choice.labelKey);
  }

  private getAdminTranslation(text: AdminTranslation) {
    const lang = this.lang();
    if (lang === 'pl') {
      return text.pl;
    }
    if (lang === 'en') {
      return text.en ? text.en : text.pl;
    }
    if (lang === 'ger') {
      return text.ger ? text.ger : text.pl;
    }
    if (lang === 'jpn') {
      return text.jpn ? text.jpn : text.pl;
    }
    if (lang === 'ukr') {
      return text.ukr ? text.ukr : text.pl;
    }
    return;
  }
}
