import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UiService } from '../../core/ui.service';
import { OrderButtonComponent } from '../../shared/UI-elements/order-button/order-button.component';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../core/menu.service';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { ItemSectionComponent } from '../../shared/UI-elements/item-section/item-section.component';
import { ChoiceModalComponent } from '../choice-modal/choice-modal.component';
import { SearchBarComponent } from '../../shared/UI-elements/search-bar/search-bar.component';
import { AlergensComponent } from '../../shared/alergens/alergens.component';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    OrderButtonComponent,
    CartModalComponent,
    TranslateModule,
    RouterLink,
    ɵInternalFormsSharedModule,
    ItemSectionComponent,
    ChoiceModalComponent,
    SearchBarComponent,
    AlergensComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  navigateService = inject(UiService);
  UiService = inject(UiService);
  menuService = inject(MenuService);

  scrollHere = this.navigateService.placeToScroll();

  ngAfterViewInit() {
    if (!this.scrollHere) return;
    const startSection = document.querySelector(`.${this.scrollHere}`);
    startSection?.scrollIntoView({
      behavior: 'smooth',
    });

    this.navigateService.placeToScroll.set('');
  }
  ngOnDestroy() {
    this.UiService.isChoiceModalOpen.set(false);
    this.UiService.isQtyPopupOpen.set(false);
    this.UiService.isCartModalOpen.set(false);
    this.UiService.isSearchBarOpen.set(false);

    document.body.classList.remove('no-scroll');
  }
}
