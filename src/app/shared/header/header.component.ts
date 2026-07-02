import { Component, inject } from '@angular/core';
import { ThemeToggleComponent } from '../UI-elements/theme-toggle/theme-toggle.component';

import { TranslateModule } from '@ngx-translate/core';

import { MenuApiService } from '../../core/guest-services/menu-api.service';
import { StaffMenuComponent } from '../admin-UI/staff-menu/staff-menu.component';

@Component({
  selector: 'app-header',
  imports: [ThemeToggleComponent, TranslateModule, StaffMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  apiService = inject(MenuApiService);

  getProducts() {
    this.apiService.getProducts().subscribe((products) => {
      console.log(products);
    });
  }
}
