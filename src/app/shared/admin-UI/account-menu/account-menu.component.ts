import { Component, inject, Input } from '@angular/core';
import { AuthService } from '@core/auth.service';
import { User } from '@models/auth-models';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { AsyncPipe, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account-menu',
  imports: [NgFor, AsyncPipe, RouterLink],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.css',
})
export class AccountMenuComponent {
  authService = inject(AuthService);

  @Input() user!: User;
  allUsers$ = this.authService.allUser$;

  usersVisible = false;

  showUsers() {
    this.authService.loadAllUsers();
    this.usersVisible = !this.usersVisible;
  }
}
