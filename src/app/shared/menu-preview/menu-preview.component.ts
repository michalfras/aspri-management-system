import { Component, inject, Input } from '@angular/core';
import { ProductData } from '../../models/product-model';
import { menuItems } from '../../data/menu-cards';
import { ItemCardComponent } from '../UI-elements/item-card/item-card.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/cart.service';
import { Router } from '@angular/router';
import { UiService } from '../../core/ui.service';
import { TranslateModule } from '@ngx-translate/core';

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

  menuItems: ProductData[] = menuItems;
  popularItems: ProductData[] = [];

  btnLabel: Record<string, string> = {
    food: 'BUTTONS.FOOD-MENU.BUTTON',
    drink: 'BUTTONS.DRINK-MENU.BUTTON',
    alcohol: 'BUTTONS.ALCOHOL-MENU.BUTTON',
  };

  ngOnInit() {
    this.popularItems = this.menuItems.filter(
      (item) => item.isPopular && item.category === this.categoryName
    );
  }

  showMenu(category: string) {
    this.UiService.placeToScroll.set(category);
    this.router.navigate(['/menu']);
  }
}
