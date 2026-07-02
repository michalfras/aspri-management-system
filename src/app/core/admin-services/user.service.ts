import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUser, User } from '@models/auth-models';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);

  private allUsersSubject = new BehaviorSubject<User[]>([]);
  allUser$ = this.allUsersSubject.asObservable();

  getUserById(userId: number): Observable<User> {
    return this.http
      .get<AuthUser>(`${environment.apiUrl}/users/${userId}`)
      .pipe(
        map((user) => ({
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
        }))
      );
  }

  addUser(user: Omit<AuthUser, 'id' | 'mustChangePassword'>) {
    const authUser = {
      ...user,
      mustChangePassword: true,
    };
    return this.http.post<AuthUser>(`${environment.apiUrl}/users`, authUser);
  }

  updateUser(user: User) {
    return this.http.patch<AuthUser>(`${environment.apiUrl}/users/${user.id}`, {
      name: user.name,
      username: user.username,
      role: user.role,
    });
  }

  deleteUser(userId: number) {
    return this.http.delete<AuthUser>(`${environment.apiUrl}/users/${userId}`);
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
}
