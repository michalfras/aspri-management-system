import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StaffMenuComponent } from '../staff-menu/staff-menu.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  imports: [RouterLink, StaffMenuComponent],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css',
})
export class AdminNavbarComponent {
  location = inject(Location);

  goBack() {
    this.location.back();
  }
}
