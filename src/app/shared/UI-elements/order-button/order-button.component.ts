import { Component, inject, Input } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CartService } from '../../../core/cart.service';
import { LanguageService } from '../../../core/language.service';
import { UiService } from '../../../core/ui.service';

@Component({
  selector: 'app-order-button',
  imports: [TranslateModule],
  templateUrl: './order-button.component.html',
  styleUrl: './order-button.component.css',
})
export class OrderButtonComponent {
  @Input() inMenu!: boolean;
  @Input() openCart!: boolean;

  lang = inject(LanguageService);
  cartService = inject(CartService);
  UiService = inject(UiService);
  translateService = inject(LanguageService);

  showModal(event: Event) {
    if (this.openCart) {
      this.UiService.closeCartModal();
      this.translateService.isWaiterMode.set(false);
      event.stopPropagation();
    } else {
      this.UiService.openCartModal();
      event.stopPropagation();
    }
  }
}
