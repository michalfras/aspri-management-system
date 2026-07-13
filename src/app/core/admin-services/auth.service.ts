import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthUser, LoginRequest, User } from '@models/auth-models';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Subject } from 'rxjs';
import { AlertService } from '../guest-services/alert.service';
import { UiService } from '../shared-services/ui.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  alertService = inject(AlertService);
  UiService = inject(UiService);
  router = inject(Router);

  private userSubject = new BehaviorSubject<User | null>(this.loadUserLS());
  user$ = this.userSubject.asObservable();

  loadUserLS() {
    let user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user) as User;
    }
    return null;
  }

  login(loginData: LoginRequest) {
    this.http
      .get<AuthUser[]>(
        `${environment.apiUrl}/users?username=${loginData.username}`
      )
      .subscribe((resp) => {
        const userAuth = resp[0];
        if (!userAuth) {
          this.alertService.showAlert('Brak Użytkownika', 'red');
          return;
        }
        if (loginData.password === userAuth.password) {
          const user: User = {
            id: userAuth.id,
            username: userAuth.username,
            name: userAuth.name,
            role: userAuth.role,
          };
          this.userSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
          this.alertService.showAlert('Zalogowano', 'green');
          return;
        }
        this.alertService.showAlert('Hasło Niepoprawne', 'red');
      });
  }
  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    this.UiService.isAccountMenuOpen.set(false);
    this.router.navigate(['/home']);
  }

  checkOldPassword(id: number, password: string) {
    return this.http.get<AuthUser>(`${environment.apiUrl}/users/${id}`).pipe(
      map((user) => {
        return user.password === password;
      })
    );
  }
}
