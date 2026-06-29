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

  private userSubject = new BehaviorSubject<User | null>(this.loadUserLS());
  user$ = this.userSubject.asObservable();
  private allUsersSubject = new BehaviorSubject<User[]>([]);
  allUser$ = this.allUsersSubject.asObservable();

  loadUserLS() {
    let user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user) as User;
    }
    return null;
  }

  loadAllUsers() {
    this.http
      .get<AuthUser[]>(`${environment.apiUrl}/users`)
      .subscribe((resp) => {
        const allUsers: User[] = resp.map((user) => {
          return {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            isProtected: user.isProtected,
          };
        });

        this.allUsersSubject.next(allUsers);
      });
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
  }
}
