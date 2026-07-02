import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { ThemeService } from '@core/shared-services/theme.service';
import { StaffMenuComponent } from '@shared/admin-UI/staff-menu/staff-menu.component';
import { AdminNavbarComponent } from '@shared/admin-UI/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, AdminNavbarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  themeService = inject(ThemeService);

  ngOnInit() {
    this.themeService.forceLightTheme();
  }

  ngOnDestroy() {
    this.themeService.loadTheme();
  }
}
