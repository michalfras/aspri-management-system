import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { AdminNotificationService } from '@core/admin-services/admin-notification.service';
import { UserService } from '@core/admin-services/user.service';
import { AuthUser, UserRole } from '@models/auth-models';
import { ConfirmDialogComponent } from '@shared/admin-UI/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-add-user',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent {
  router = inject(Router);
  dialog = inject(MatDialog);
  notificationService = inject(AdminNotificationService);
  userService = inject(UserService);

  addForm = new FormGroup({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ],
      nonNullable: true,
    }),
    login: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ],
      asyncValidators: [this.userService.isUsernameTaken()],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    role: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  ngOnInit() {
    this.generatePassword();
  }

  generatePassword(length = 6) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    const randomPassword = Array.from(
      array,
      (number) => chars[number % chars.length]
    ).join('');

    this.addForm.controls.password.setValue(randomPassword);
  }

  save() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    this.dialog
      .open(ConfirmDialogComponent, {
        width: '350px',
        enterAnimationDuration: '250ms',
        exitAnimationDuration: '150ms',
        data: {
          title: `Hasło: ${this.addForm.controls.password.value}`,
          message:
            'Po zapisaniu Użytkownika nie będzie można odczytać tego hasła. Upewnij się, że je zapisałeś.',
          confirmText: 'Zapisz',
          cancelText: 'Anuluj',
        },
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => {
          const userData = {
            name: this.addForm.controls.name.value,
            username: this.addForm.controls.login.value,
            role: this.addForm.controls.role.value as UserRole,
            password: this.addForm.controls.password.value,
            isProtected: false,
          };
          return this.userService.addUser(userData);
        })
      )
      .subscribe({
        next: () => {
          this.addForm.reset();
          this.generatePassword();
          this.notificationService.openSnackBar('Zapisano Użytkownika', 'X');
          console.log(this.addForm);
        },
        error: () => {
          this.notificationService.openSnackBar(
            'Nie udało się zapisać, spróbuj ponownie',
            'X'
          );
        },
      });
  }

  cancel() {
    if (this.addForm.pristine) {
      this.router.navigate(['/home']);
      return;
    }

    this.dialog
      .open(ConfirmDialogComponent, {
        width: '350px',
        enterAnimationDuration: '250ms',
        exitAnimationDuration: '150ms',
        data: {
          title: 'Anulować Dodawanie?',
          message: 'Wprowadzone dane nowego Użytkownika nie zostaną zapisane.',
          confirmText: 'Anuluj',
          cancelText: 'Kontynuuj Dodawanie',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.router.navigate(['/home']);
          this.notificationService.openSnackBar('Anulowano Edycję', 'X');
        }
      });
  }
}
