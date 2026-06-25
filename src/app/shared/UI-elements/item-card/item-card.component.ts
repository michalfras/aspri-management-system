import { CommonModule } from '@angular/common';
import { Component, inject, Input, Output } from '@angular/core';
import { ProductData } from '../../../models/product-model';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../../core/cart.service';
import { UiService } from '../../../core/ui.service';
import { BadgeComponent } from '../badge/badge.component';
import { ThemeService } from '../../../core/theme.service';

@Component({
  selector: 'app-item-card',
  imports: [CommonModule, TranslateModule, BadgeComponent],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css',
})
export class ItemCardComponent {
  @Input() product!: ProductData;
  cartService = inject(CartService);
  UiService = inject(UiService);
  themeService = inject(ThemeService);
}
