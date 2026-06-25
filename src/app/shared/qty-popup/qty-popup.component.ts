import { Component, inject, Input } from '@angular/core';
import { CartService } from '../../core/cart.service';
import { DecimalPipe } from '@angular/common';
import { UiService } from '../../core/ui.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-qty-popup',
  imports: [DecimalPipe, TranslateModule],
  templateUrl: './qty-popup.component.html',
  styleUrl: './qty-popup.component.css',
})
export class QtyPopupComponent {
  cartService = inject(CartService);
  UiService = inject(UiService);

  clickedPlus = false;
  clickedMinus = false;

  onClick(whichOne: 'plus' | 'minus') {
    if (whichOne === 'plus') {
      this.clickedPlus = true;
      setTimeout(() => (this.clickedPlus = false), 180);
      return;
    }

    this.clickedMinus = true;
    setTimeout(() => (this.clickedMinus = false), 180);
  }
}
