import { Component, inject, Input } from '@angular/core';
import { MenuService } from '../../../core/guest-services/menu.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../../core/guest-services/cart.service';

import { UiService } from '../../../core/shared-services/ui.service';
import { BadgeComponent } from '../badge/badge.component';

import { AuthService } from '@core/admin-services/auth.service';
import { RouterLink } from '@angular/router';
import { LanguageService } from '@core/shared-services/language.service';

import { ProductService } from '@core/admin-services/product.service';
import { ProductData } from '@models/product-model';

@Component({
  selector: 'app-item-section',
  imports: [CommonModule, TranslateModule, BadgeComponent, RouterLink],
  templateUrl: './item-section.component.html',
  styleUrl: './item-section.component.css',
})
export class ItemSectionComponent {
  @Input() category!: 'food' | 'drink' | 'alcohol';
  isHidden = false;

  readonly languageService = inject(LanguageService);
  menuService = inject(MenuService);
  cartService = inject(CartService);
  UiService = inject(UiService);
  authService = inject(AuthService);
  productService = inject(ProductService);

  keepOriginalOrder = () => 0;

  setVisibility(product: ProductData) {
    this.productService
      .hideProduct(product.id, !product.isHidden)
      .subscribe(() => {
        this.menuService.loadAllMenuProducts();
      });
  }
}
