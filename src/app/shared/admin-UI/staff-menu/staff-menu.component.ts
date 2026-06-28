import { Component, inject, signal } from '@angular/core';
import { UiService } from '../../../core/ui.service';
import { AuthService } from '../../../core/auth.service';
import { AsyncPipe } from '@angular/common';
import { LoginPanelComponent } from '../login-panel/login-panel.component';

@Component({
  selector: 'app-staff-menu',
  imports: [AsyncPipe, LoginPanelComponent],
  templateUrl: './staff-menu.component.html',
  styleUrl: './staff-menu.component.css',
})
export class StaffMenuComponent {
  uiService = inject(UiService);
  authService = inject(AuthService);
  isAccountMenuOpen = false;
  accountName = '';

  toggleMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
    if (this.isAccountMenuOpen) {
      document.body.classList.add('no-scroll');
    }
    if (!this.isAccountMenuOpen) {
      document.body.classList.remove('no-scroll');
    }
  }
}
