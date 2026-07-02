import { Component, inject, Input } from '@angular/core';
import { AuthService } from '@core/admin-services/auth.service';
import { User } from '@models/auth-models';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '@core/admin-services/user.service';
import { UiService } from '@core/shared-services/ui.service';

@Component({
  selector: 'app-account-menu',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.css',
})
export class AccountMenuComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  UiService = inject(UiService);
  router = inject(Router);

  @Input() user!: User;
  allUsers$ = this.userService.allUser$;

  usersVisible = false;

  showUsers() {
    this.userService.loadAllUsers();
    this.usersVisible = !this.usersVisible;
  }
  openEditUser(userId: number) {
    this.UiService.isAccountMenuOpen.set(false);
    this.router.navigate(['/user', userId, 'edit']);
  }
}
