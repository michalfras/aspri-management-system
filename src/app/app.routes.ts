import { Routes } from '@angular/router';
import { MenuComponent } from './features/guest/menu/menu.component';
import { HomeComponent } from './features/guest/home/home.component';
import { firstVisitGuard } from './core/guards/first-visit.guard';
import { WelcomeScreenComponent } from './features/guest/welcome-screen/welcome-screen.component';
import { AccessComponent } from './features/guest/access/access.component';
import { accessGuard } from './core/guards/access.guard';
import { EditUserComponent } from '@features/admin/user/edit-user/edit-user.component';
import { AddUserComponent } from '@features/admin/user/add-user/add-user.component';

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
  { path: 'user/:id/edit', component: EditUserComponent },
  { path: 'user/add', component: AddUserComponent },
];
