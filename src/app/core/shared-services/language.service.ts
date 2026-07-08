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
      this.translate.use(userLang).subscribe(() => {
        document.documentElement.lang = userLang;
        this.lang.set(userLang);
      });
    } else {
      this.translate.use('pl');
      document.documentElement.lang = 'pl';
      this.lang.set('pl');
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

  getTranslatedName(product: Pick<ProductData, 'nameKey' | 'adminName'>) {
    if (product.adminName) {
      const translatedAdminName = this.getAdminTranslation(product.adminName);
      if (translatedAdminName) return translatedAdminName;
    }
    if (product.nameKey) {
      const translatedNameKey = this.translate.instant(product.nameKey);
      if (translatedNameKey !== product.nameKey) return translatedNameKey;
    }
    return product.adminName?.pl ?? product.nameKey;
  }
  getTranslatedInfo(product: Pick<ProductData, 'adminInfo' | 'infoKey'>) {
    if (product.adminInfo) {
      const translatedAdminName = this.getAdminTranslation(product.adminInfo);
      if (translatedAdminName) return translatedAdminName;
    }
    if (product.infoKey) {
      const translatedNameKey = this.translate.instant(product.infoKey);
      if (translatedNameKey !== product.infoKey) return translatedNameKey;
    }
    return product.adminInfo?.pl ?? product.infoKey;
  }
  getTranslatedShortInfo(
    product: Pick<ProductData, 'adminShortInfo' | 'shortInfoKey'>
  ) {
    if (product.adminShortInfo) {
      const translatedAdminName = this.getAdminTranslation(
        product.adminShortInfo
      );
      if (translatedAdminName) return translatedAdminName;
    }
    if (product.shortInfoKey) {
      const translatedNameKey = this.translate.instant(product.shortInfoKey);
      if (translatedNameKey !== product.shortInfoKey) return translatedNameKey;
    }
    return product.adminShortInfo?.pl ?? product.shortInfoKey;
  }
  getTranslatedChoice(choice: Pick<ProductChoice, 'adminLabel' | 'labelKey'>) {
    if (choice.adminLabel) {
      const translatedAdminName = this.getAdminTranslation(choice.adminLabel);
      if (translatedAdminName) return translatedAdminName;
    }
    if (choice.labelKey) {
      const translatedNameKey = this.translate.instant(choice.labelKey);
      if (translatedNameKey !== choice.labelKey) return translatedNameKey;
    }
    return choice.adminLabel?.pl ?? choice.labelKey;
  }

  private getAdminTranslation(text: AdminTranslation) {
    const lang = this.lang();
    if (lang === 'pl') {
      return text.pl;
    }
    if (lang === 'en') {
      return text.en;
    }
    if (lang === 'ger') {
      return text.ger;
    }
    if (lang === 'jpn') {
      return text.jpn;
    }
    if (lang === 'ukr') {
      return text.ukr;
    }
    return;
  }
}
