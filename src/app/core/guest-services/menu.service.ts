import { computed, inject, Injectable, signal } from '@angular/core';
import { ProductData } from '../../models/product-model';
import { TranslateService } from '@ngx-translate/core';
import { MenuApiService } from './menu-api.service';
import { LanguageService } from '@core/shared-services/language.service';
import { AuthService } from '@core/admin-services/auth.service';
import { map, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  translateService = inject(TranslateService);
  languageService = inject(LanguageService);
  menuApiService = inject(MenuApiService);
  private readonly authService = inject(AuthService);
  allMenuProducts = signal<ProductData[]>([]);
  searchInputValue = signal<string>('');

  constructor() {
    this.authService.user$.subscribe(() => {
      this.loadAllMenuProducts();
    });
  }

  private filteredBySearchBarMenuProducts = computed<ProductData[]>(() => {
    const searchQuery = this.searchInputValue().toLowerCase().trim();
    if (!searchQuery) return this.allMenuProducts();
    return this.allMenuProducts().filter((product) => {
      const productName = this.languageService
        .getTranslatedName(product)
        .toLowerCase();
      let productInfo =
        this.languageService.getTranslatedInfo(product)?.toLowerCase() ?? '';
      return (
        productName.includes(searchQuery) || productInfo.includes(searchQuery)
      );
    });
  });

  groupedMenuProducts = computed<Record<string, Record<string, ProductData[]>>>(
    () => {
      const groupedProduct: Record<string, Record<string, ProductData[]>> = {};

      this.filteredBySearchBarMenuProducts().forEach((product) => {
        const category = product.category;
        const subcategory = product.subcategory;

        if (!groupedProduct[category]) {
          groupedProduct[category] = {};
        }
        if (!groupedProduct[category][subcategory]) {
          groupedProduct[category][subcategory] = [];
        }
        groupedProduct[category][subcategory].push(product);
      });

      return groupedProduct;
    }
  );

  loadAllMenuProducts() {
    const admin = this.authService.currentUser?.role === 'admin';
    this.menuApiService.getProducts().subscribe((products) => {
      if (!admin)
        products = products.filter((product) => {
          return product.isHidden !== true;
        });
      this.allMenuProducts.set(products);
    });
  }
}
