import { Component, computed, inject, Input } from '@angular/core';
import { ProductData } from '../../models/product-model';
import { ItemCardComponent } from '../UI-elements/item-card/item-card.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/guest-services/cart.service';
import { Router } from '@angular/router';
import { UiService } from '../../core/shared-services/ui.service';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService } from '../../core/guest-services/menu.service';

@Component({
  selector: 'app-menu-preview',
  imports: [ItemCardComponent, CommonModule, TranslateModule],

  templateUrl: './menu-preview.component.html',
  styleUrl: './menu-preview.component.css',
})
export class MenuPreviewComponent {
  @Input() categoryName!: 'food' | 'drink' | 'alcohol';
  cartService = inject(CartService);
  UiService = inject(UiService);
  router = inject(Router);
  menuService = inject(MenuService);

  menuItems = computed<ProductData[]>(() => {
    return this.menuService.allMenuProducts();
  });
  popularItems = computed<ProductData[]>(() => {
    return this.menuService
      .allMenuProducts()
      .filter((item) => item.isPopular && item.category === this.categoryName);
  });

  btnLabel: Record<string, string> = {
    food: 'BUTTONS.FOOD-MENU.BUTTON',
    drink: 'BUTTONS.DRINK-MENU.BUTTON',
    alcohol: 'BUTTONS.ALCOHOL-MENU.BUTTON',
  };

  showMenu(category: string) {
    this.UiService.placeToScroll.set(category);
    this.router.navigate(['/menu']);
  }
}
