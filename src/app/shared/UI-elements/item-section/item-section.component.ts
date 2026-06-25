import { Component, inject, Input } from '@angular/core';
import { MenuService } from '../../../core/menu.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../../core/cart.service';

import { UiService } from '../../../core/ui.service';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-item-section',
  imports: [CommonModule, TranslateModule, BadgeComponent],
  templateUrl: './item-section.component.html',
  styleUrl: './item-section.component.css',
})
export class ItemSectionComponent {
  @Input() category!: 'food' | 'drink' | 'alcohol';

  menuService = inject(MenuService);
  cartService = inject(CartService);
  UiService = inject(UiService);

  keepOriginalOrder = () => 0;
}
