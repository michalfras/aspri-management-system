import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { OrderButtonComponent } from '../../shared/UI-elements/order-button/order-button.component';
import { MenuPreviewComponent } from '../../shared/menu-preview/menu-preview.component';

import { LanguageFlagsComponent } from '../../shared/language-flags/language-flags.component';
import { CartService } from '../../core/cart.service';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { ChoiceModalComponent } from '../choice-modal/choice-modal.component';

import { UiService } from '../../core/ui.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AlergensComponent } from '../../shared/alergens/alergens.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    HeaderComponent,
    OrderButtonComponent,
    MenuPreviewComponent,
    LanguageFlagsComponent,
    CartModalComponent,
    ChoiceModalComponent,
    TranslateModule,
    AlergensComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  cartService = inject(CartService);
  UiService = inject(UiService);

  ngOnDestroy() {
    this.UiService.isChoiceModalOpen.set(false);
    this.UiService.isQtyPopupOpen.set(false);
    this.UiService.isCartModalOpen.set(false);
    document.body.classList.remove('no-scroll');
  }
  isItOwner() {
    return localStorage.getItem('accessType') === 'owner';
  }
}
