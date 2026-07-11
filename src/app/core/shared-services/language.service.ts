import { inject, Injectable, signal } from '@angular/core';
import {
  AdminTranslation,
  ProductChoice,
  ProductData,
} from '@models/product-model';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, map, Observable, of, switchMap } from 'rxjs';

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

      if (translatedNameKey !== product.nameKey) {
        return translatedNameKey;
      }
    }

    return product.adminName?.pl ?? product.nameKey;
  }

  getTranslatedInfo(product: Pick<ProductData, 'adminInfo' | 'infoKey'>) {
    if (product.adminInfo) {
      const translatedAdminInfo = this.getAdminTranslation(product.adminInfo);

      if (translatedAdminInfo) return translatedAdminInfo;
    }
    if (product.infoKey) {
      const translatedInfoKey = this.translate.instant(product.infoKey);
      if (translatedInfoKey !== product.infoKey) {
        return translatedInfoKey;
      }
    }
    return product.adminInfo?.pl ?? product.infoKey;
  }

  getTranslatedShortInfo(
    product: Pick<ProductData, 'adminShortInfo' | 'shortInfoKey'>
  ) {
    if (product.adminShortInfo) {
      const translatedAdminShortInfo = this.getAdminTranslation(
        product.adminShortInfo
      );
      if (translatedAdminShortInfo) return translatedAdminShortInfo;
    }
    if (product.shortInfoKey) {
      const translatedShortInfoKey = this.translate.instant(
        product.shortInfoKey
      );
      if (translatedShortInfoKey !== product.shortInfoKey) {
        return translatedShortInfoKey;
      }
    }

    return product.adminShortInfo?.pl ?? product.shortInfoKey;
  }
  getTranslatedChoice(choice: Pick<ProductChoice, 'adminLabel' | 'labelKey'>) {
    if (choice.adminLabel) {
      const translatedAdminLabel = this.getAdminTranslation(choice.adminLabel);
      if (translatedAdminLabel) return translatedAdminLabel;
    }
    if (choice.labelKey) {
      const translatedLabelKey = this.translate.instant(choice.labelKey);
      if (translatedLabelKey !== choice.labelKey) {
        return translatedLabelKey;
      }
    }
    return choice.adminLabel?.pl ?? choice.labelKey;
  }

  async getAdminFormTranslatedName(
    product: Pick<ProductData, 'nameKey' | 'adminName'>,
    language: 'pl' | 'en' | 'ger' | 'jpn' | 'ukr'
  ): Promise<string> {
    if (product.adminName) {
      const translatedAdminName = this.getAdminTranslation(
        product.adminName,
        language
      );
      if (translatedAdminName) {
        return translatedAdminName;
      }
    }
    if (product.nameKey) {
      const currentLang = this.translate.getCurrentLang();

      return await firstValueFrom(
        this.translate.use(language).pipe(
          switchMap(() => {
            const translatedNameKey = this.translate.instant(product.nameKey);

            const result =
              translatedNameKey !== product.nameKey
                ? translatedNameKey
                : product.adminName?.pl ?? '';

            return this.translate.use(currentLang).pipe(map(() => result));
          })
        )
      );
    }
    return product.adminName?.pl ?? '';
  }

  async getAdminFormTranslatedInfo(
    product: Pick<ProductData, 'infoKey' | 'adminInfo'>,
    language: 'pl' | 'en' | 'ger' | 'jpn' | 'ukr'
  ): Promise<string> {
    if (product.adminInfo) {
      const translatedAdminName = this.getAdminTranslation(
        product.adminInfo,
        language
      );
      if (translatedAdminName) {
        return translatedAdminName;
      }
    }
    if (product.infoKey) {
      const currentLang = this.translate.getCurrentLang();

      return await firstValueFrom(
        this.translate.use(language).pipe(
          switchMap(() => {
            const translatedInfoKey = this.translate.instant(product.infoKey!);

            const result =
              translatedInfoKey !== product.infoKey
                ? translatedInfoKey
                : product.adminInfo?.pl ?? '';

            return this.translate.use(currentLang).pipe(map(() => result));
          })
        )
      );
    }
    return product.adminInfo?.pl ?? '';
  }
  async getAdminFormTranslatedShortInfo(
    product: Pick<ProductData, 'shortInfoKey' | 'adminShortInfo'>,
    language: 'pl' | 'en' | 'ger' | 'jpn' | 'ukr'
  ): Promise<string> {
    if (product.adminShortInfo) {
      const translatedAdminName = this.getAdminTranslation(
        product.adminShortInfo,
        language
      );
      if (translatedAdminName) {
        return translatedAdminName;
      }
    }
    if (product.shortInfoKey) {
      const currentLang = this.translate.getCurrentLang();

      return await firstValueFrom(
        this.translate.use(language).pipe(
          switchMap(() => {
            const translatedShortInfoKey = this.translate.instant(
              product.shortInfoKey!
            );

            const result =
              translatedShortInfoKey !== product.shortInfoKey
                ? translatedShortInfoKey
                : product.adminShortInfo?.pl ?? '';

            return this.translate.use(currentLang).pipe(map(() => result));
          })
        )
      );
    }
    return product.adminShortInfo?.pl ?? '';
  }

  async getAdminFormTranslatedChoice(
    choice: Pick<ProductChoice, 'labelKey' | 'adminLabel'>,
    language: 'pl' | 'en' | 'ger' | 'jpn' | 'ukr'
  ): Promise<string> {
    if (choice.adminLabel) {
      const translatedAdminName = this.getAdminTranslation(
        choice.adminLabel,
        language
      );
      if (translatedAdminName) {
        return translatedAdminName;
      }
    }
    if (choice.labelKey) {
      const currentLang = this.translate.getCurrentLang();

      return await firstValueFrom(
        this.translate.use(language).pipe(
          switchMap(() => {
            const translatedLabelKey = this.translate.instant(choice.labelKey!);

            const result =
              translatedLabelKey !== choice.labelKey
                ? translatedLabelKey
                : choice.adminLabel?.pl ?? '';

            return this.translate.use(currentLang).pipe(map(() => result));
          })
        )
      );
    }
    return choice.adminLabel?.pl ?? '';
  }

  private getAdminTranslation(
    text: AdminTranslation,
    language?: 'pl' | 'en' | 'ger' | 'jpn' | 'ukr'
  ) {
    const lang = language ?? this.lang();
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
