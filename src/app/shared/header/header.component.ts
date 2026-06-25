import { Component, inject } from '@angular/core';
import { ThemeToggleComponent } from '../UI-elements/theme-toggle/theme-toggle.component';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [ThemeToggleComponent, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
