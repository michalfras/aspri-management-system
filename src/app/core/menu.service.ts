import { computed, inject, Injectable, signal } from '@angular/core';
import { menuItems } from '../data/menu-cards';
import { ProductData } from '../models/product-model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  translateService = inject(TranslateService);

  private allMenuProducts = signal<ProductData[]>(menuItems);
  searchInputValue = signal<string>('');

  private filteredBySearchBarMenuProducts = computed<ProductData[]>(() => {
    const searchQuery = this.searchInputValue().toLowerCase().trim();

    if (!searchQuery) return this.allMenuProducts();

    return this.allMenuProducts().filter((product) => {
      const productName = this.translateService
        .instant(product.nameKey)
        .toLowerCase();
      const productInfo = product.infoKey
        ? this.translateService.instant(product.infoKey).toLowerCase()
        : '';
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
}
