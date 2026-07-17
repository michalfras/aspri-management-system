import { Component, inject } from '@angular/core';
import { UiService } from '@core/shared-services/ui.service';
import { OrderButtonComponent } from '@shared/UI-elements/order-button/order-button.component';
import { CartModalComponent } from '@features/guest/cart-modal/cart-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuService } from '@core/guest-services/menu.service';
import { ItemSectionComponent } from '@shared/UI-elements/item-section/item-section.component';
import { ChoiceModalComponent } from '@features/guest/choice-modal/choice-modal.component';
import { SearchBarComponent } from '@shared/UI-elements/search-bar/search-bar.component';
import { AlergensComponent } from '@shared/alergens/alergens.component';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    OrderButtonComponent,
    CartModalComponent,
    TranslateModule,

    ItemSectionComponent,
    ChoiceModalComponent,
    SearchBarComponent,
    AlergensComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  UiService = inject(UiService);
  menuService = inject(MenuService);
  router = inject(Router);
  scrollHere = this.UiService.placeToScroll();

  ngAfterViewInit() {
    if (!this.scrollHere) return;
    const startSection = document.querySelector(`.${this.scrollHere}`);
    startSection?.scrollIntoView({
      behavior: 'smooth',
    });

    this.UiService.placeToScroll.set('');
  }

  backToHome() {
    this.router.navigate(['/']);
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    this.UiService.isChoiceModalOpen.set(false);
    this.UiService.isQtyPopupOpen.set(false);
    this.UiService.isCartModalOpen.set(false);
    this.UiService.isSearchBarOpen.set(false);

    document.body.classList.remove('no-scroll');
  }
}
