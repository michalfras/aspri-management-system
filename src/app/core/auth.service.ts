import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthUser, LoginRequest, User } from '@models/auth-models';
import { environment } from 'environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  alertService = inject(AlertService);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

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
          this.isLoggedInSubject.next(true);

          this.alertService.showAlert('Zalogowano', 'green');
          return;
        }
        this.alertService.showAlert('Hasło Niepoprawne', 'red');
      });
  }
}
