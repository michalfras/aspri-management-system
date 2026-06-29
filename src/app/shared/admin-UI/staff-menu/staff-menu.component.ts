import { Component, inject, signal, ViewChild } from '@angular/core';
import { UiService } from '../../../core/ui.service';
import { AuthService } from '../../../core/auth.service';
import { AsyncPipe } from '@angular/common';
import { LoginPanelComponent } from '../login-panel/login-panel.component';
import { AccountMenuComponent } from '../account-menu/account-menu.component';

@Component({
  selector: 'app-staff-menu',
  imports: [AsyncPipe, LoginPanelComponent, AccountMenuComponent],
  templateUrl: './staff-menu.component.html',
  styleUrl: './staff-menu.component.css',
})
export class StaffMenuComponent {
  uiService = inject(UiService);
  authService = inject(AuthService);

  @ViewChild(LoginPanelComponent) loginPanel!: LoginPanelComponent;
  user$ = this.authService.user$;
  isAccountMenuOpen = false;

  toggleMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
    if (this.isAccountMenuOpen) {
      document.body.classList.add('no-scroll');
    }
    if (!this.isAccountMenuOpen) {
      document.body.classList.remove('no-scroll');
      this.loginPanel.resetControls();
    }
  }
}
