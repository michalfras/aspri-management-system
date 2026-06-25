import { Routes } from '@angular/router';
import { MenuComponent } from './features/menu/menu.component';
import { HomeComponent } from './features/home/home.component';
import { firstVisitGuard } from './core/guards/first-visit.guard';
import { WelcomeScreenComponent } from './features/welcome-screen/welcome-screen.component';
import { AccessComponent } from './features/access/access.component';
import { accessGuard } from './core/guards/access.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    canActivate: [accessGuard, firstVisitGuard],
    component: HomeComponent,
  },
  {
    path: 'menu',
    canActivate: [accessGuard],
    component: MenuComponent,
  },
  {
    path: 'welcome',
    canActivate: [accessGuard],
    component: WelcomeScreenComponent,
  },
  { path: 'access', component: AccessComponent },
];
