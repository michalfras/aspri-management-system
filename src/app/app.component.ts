import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/UI-elements/alert/alert.component';
import { AccessService } from './core/guest-services/access.service';
import { MenuService } from './core/guest-services/menu.service';
import { ThemeService } from '@core/shared-services/theme.service';
import { LanguageService } from '@core/shared-services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  accessService = inject(AccessService);
  menuService = inject(MenuService);
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);

  ngOnInit() {
    this.accessService.checkAccess();
    this.menuService.loadAllMenuProducts();
    this.themeService.loadTheme();
  }
}
