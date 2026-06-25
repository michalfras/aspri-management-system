import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UiService } from '../../../core/ui.service';
import { ThemeService } from '../../../core/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [TranslateModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  UiService = inject(UiService);
  themeService = inject(ThemeService);

  isLightMode() {
    if (this.themeService.theme() === 'light') return true;
    if (this.themeService.theme() === 'dark') return false;
    return !this.themeService.isSystemDark();
  }
  isAutoMode() {
    return this.themeService.theme() === 'auto';
  }

  toggleTheme() {
    if (this.themeService.theme() === 'light') {
      this.themeService.setTheme('dark');
      return;
    }
    if (this.themeService.theme() === 'dark') {
      this.themeService.setTheme('light');
      return;
    }
    if (this.themeService.theme() === 'auto') {
      if (this.themeService.isSystemDark()) {
        this.themeService.setTheme('light');
      } else this.themeService.setTheme('dark');
      return;
    }
  }
  setAutoTheme() {
    this.themeService.setTheme('auto');
  }
}
