import { Routes } from '@angular/router';
import { MenuComponent } from './features/guest/menu/menu.component';
import { HomeComponent } from './features/guest/home/home.component';
import { firstVisitGuard } from './core/guards/first-visit.guard';
import { WelcomeScreenComponent } from './features/guest/welcome-screen/welcome-screen.component';
import { AccessComponent } from './features/guest/access/access.component';
import { accessGuard } from './core/guards/access.guard';
import { EditUserComponent } from '@features/admin/user/edit-user/edit-user.component';
import { AddUserComponent } from '@features/admin/user/add-user/add-user.component';
import { AdminComponent } from '@features/admin/admin.component';
import { OrderHistoryComponent } from '@features/admin/order-history/order-history.component';
import { EditProductComponent } from '@features/admin/product/edit-product/edit-product.component';
import { AddProductComponent } from '@features/admin/product/add-product/add-product.component';
import { MyAccountComponent } from '@features/admin/user/my-account/my-account.component';

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
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'user/:id/edit', component: EditUserComponent },
      { path: 'user/add', component: AddUserComponent },
      { path: 'user/my-account/:id', component: MyAccountComponent },
      { path: 'order_history', component: OrderHistoryComponent },
      { path: 'product/edit/:id', component: EditProductComponent },
      { path: 'product/add', component: AddProductComponent },
    ],
  },
];
