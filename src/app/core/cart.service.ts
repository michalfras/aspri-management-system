import { computed, inject, Injectable, signal } from '@angular/core';
import { CartItem, ProductChoice, ProductData } from '../models/product-model';
import { AlertService } from './alert.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  alertService = inject(AlertService);
  UiService = inject(UiService);

  cartItems = signal<CartItem[]>([]);
  selectedCartItemKeys = signal<{
    productId: number;
    productChoices?: string;
  } | null>(null);

  selectedItem = computed<CartItem | null>(() => {
    const productFindKeys = this.selectedCartItemKeys();
    if (productFindKeys === null) return null;

    return (
      this.cartItems().find(
        (i) =>
          i.product.id === productFindKeys.productId &&
          i.selectedChoice?.labelKey === productFindKeys.productChoices
      ) ?? null
    );
  });

  cartTotalPrice = computed<number>(() => {
    let totalPrice = 0;
    this.cartItems().map((item) => {
      const price = item.selectedChoice
        ? item.selectedChoice.price * item.quantity
        : item.product.price * item.quantity;
      totalPrice = totalPrice + price;
    });
    return totalPrice;
  });

  cartTotalQuantity = computed<number>(() => {
    let totalQuantity = 0;
    this.cartItems().map((item) => {
      const qty = item.quantity;
      totalQuantity = totalQuantity + qty;
    });
    return totalQuantity;
  });

  constructor() {
    this.init();
  }

  init() {
    const userCart = localStorage.getItem('aspri-cart');
    if (userCart) {
      this.cartItems.set(JSON.parse(userCart));
    }
  }

  addToOrder(oneProductData: ProductData) {
    if (oneProductData.choices || oneProductData.forcePopup) {
      this.UiService.forcePopup(oneProductData);
    } else this.addToCart(oneProductData);
  }

  addToCart(product: ProductData, selectedOneChoice?: ProductChoice) {
    this.cartItems.update((items) => {
      const isInCart = items.find((item) => {
        return (
          item.product.id === product.id &&
          item.selectedChoice?.labelKey === selectedOneChoice?.labelKey
        );
      });

      if (isInCart) {
        return items.map((item) =>
          item.product.id === product.id &&
          item.selectedChoice?.labelKey === selectedOneChoice?.labelKey
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }
      return [
        ...items,
        { product, quantity: 1, selectedChoice: selectedOneChoice },
      ];
    });

    localStorage.setItem('aspri-cart', JSON.stringify(this.cartItems()));
    this.alertService.showAlert('GENERAL.ADDED');
  }

  removeFromCart() {
    this.cartItems.update((products) =>
      products.filter((item) => {
        return !(
          item.product.id === this.selectedItem()?.product.id &&
          item.selectedChoice?.labelKey ===
            this.selectedItem()?.selectedChoice?.labelKey
        );
      })
    );
    this.UiService.closeQtyPopup();
    localStorage.setItem('aspri-cart', JSON.stringify(this.cartItems()));
    this.alertService.showAlert('GENERAL.DELETED', 'red');
  }
  removeAllFromCart() {
    this.cartItems.set([]);
    this.UiService.isRemoveAllConfirmationVisible.set(false);
    this.alertService.showAlert('GENERAL.ALL-DELETED', 'red');
    localStorage.setItem('aspri-cart', JSON.stringify(this.cartItems()));
  }

  increaseQtyOfItem() {
    const selected = this.selectedCartItemKeys();
    if (!selected) return;

    this.cartItems.update((items) =>
      items.map((i) =>
        i.product.id === selected.productId &&
        i.selectedChoice?.labelKey === selected.productChoices
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
    localStorage.setItem('aspri-cart', JSON.stringify(this.cartItems()));
  }

  decreaseQtyOfItem() {
    const selectedItem = this.selectedItem();
    if (!selectedItem) return;

    if (selectedItem?.quantity <= 1) return;

    this.cartItems.update((items) =>
      items.map((i) =>
        i.product.id === selectedItem.product.id &&
        i.selectedChoice?.labelKey === selectedItem.selectedChoice?.labelKey
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    );
    localStorage.setItem('aspri-cart', JSON.stringify(this.cartItems()));
  }

  getTotalCartItemPrice(item: CartItem | null) {
    if (!item) return 0;

    let price: number;
    if (item?.selectedChoice) {
      price = item?.selectedChoice.price;
    } else {
      price = item.product.price;
    }

    let totalPrice = price * item.quantity;
    return totalPrice;
  }

  checkIfMultiplePrices(product: ProductData) {
    if (product.choices) {
      const prices = product.choices.map((item) => item.price);
      const howManyPrices = new Set(prices);
      if (howManyPrices.size > 1) {
        return [...howManyPrices].map((price) => ` ${price},- `).join('/');
      } else return `${product.price},-`;
    }

    return `${product.price},-`;
  }
}
