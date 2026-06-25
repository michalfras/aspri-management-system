import { Component, inject } from '@angular/core';
import { CartService } from '../../core/cart.service';

import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { QtyPopupComponent } from '../../shared/qty-popup/qty-popup.component';
import { CartItem } from '../../models/product-model';
import { OrderButtonComponent } from '../../shared/UI-elements/order-button/order-button.component';
import { UiService } from '../../core/ui.service';
import { LanguageService } from '../../core/language.service';

@Component({
  selector: 'app-cart-modal',
  imports: [
    CommonModule,
    OrderButtonComponent,
    TranslateModule,
    QtyPopupComponent,
  ],
  templateUrl: './cart-modal.component.html',
  styleUrl: './cart-modal.component.css',
})
export class CartModalComponent {
  cartService = inject(CartService);
  UiService = inject(UiService);
  translateService = inject(LanguageService);

  clicked = false;

  openQtyPopup(item: CartItem) {
    this.UiService.isQtyPopupOpen.set(true);
    this.cartService.selectedCartItemKeys.set({
      productId: item.product.id,
      productChoices: item.selectedChoice?.labelKey,
    });
  }
  showPlTranslation() {
    this.UiService.isPolishTranslationVisible.update((current) => !current);
    this.translateService.isWaiterMode.set(true);
  }
  closeModal() {
    this.UiService.closeCartModal();
    this.translateService.isWaiterMode.set(false);
  }
  onClick() {
    this.clicked = true;
    setTimeout(() => (this.clicked = false), 300);
    return;
  }
}
