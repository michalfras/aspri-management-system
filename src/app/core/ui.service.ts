import { computed, Injectable, signal } from '@angular/core';
import { ProductData } from '../models/product-model';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  placeToScroll = signal<string>('');
  visited = signal<boolean>(false);

  scrollY: number = 0;

  selectedProductData = signal<ProductData | null>(null);

  isCartModalOpen = signal<boolean>(false);
  isChoiceModalOpen = signal<boolean>(false);
  isQtyPopupOpen = signal<boolean>(false);
  isSearchBarOpen = signal<boolean>(false);

  isRemoveAllConfirmationVisible = signal<boolean>(false);
  isRemoveConfirmationVisible = signal<boolean>(false);
  isPolishTranslationVisible = signal<boolean>(false);

  constructor() {
    this.loadVisited();
  }

  private loadVisited() {
    this.visited.set(localStorage.getItem('visited') === 'true');
  }

  openCartModal() {
    this.scrollY = window.scrollY;
    window.scrollBy(0, -1);
    document.body.classList.add('no-scroll');
    document.body.style.top = `-${this.scrollY}px`;

    this.isCartModalOpen.set(true);
  }

  closeCartModal() {
    document.body.classList.remove('no-scroll');
    window.scrollTo(0, this.scrollY);
    document.body.style.top = '';

    this.isCartModalOpen.set(false);

    this.isRemoveAllConfirmationVisible.set(false);
    this.isPolishTranslationVisible.set(false);
  }

  forcePopup(oneProductData: ProductData) {
    this.scrollY = window.scrollY;
    window.scrollBy(0, -1);
    document.body.classList.add('no-scroll');
    document.body.style.top = `-${this.scrollY}px`;

    this.selectedProductData.set(oneProductData);
    this.isChoiceModalOpen.set(true);
  }

  closeQtyPopup() {
    this.isQtyPopupOpen.set(false);
    this.isRemoveConfirmationVisible.set(false);
  }
  askToRemoveFromCart() {
    this.isRemoveConfirmationVisible.set(true);
  }
  stopRemovingFromCart() {
    this.isRemoveConfirmationVisible.set(false);
  }
  askToRemoveAllFromCart() {
    this.isRemoveAllConfirmationVisible.set(true);
  }
  stopRemovingAllFromCart() {
    this.isRemoveAllConfirmationVisible.set(false);
  }
}
