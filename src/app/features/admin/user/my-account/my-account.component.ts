import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@core/admin-services/user.service';
import { AuthUser, User } from '@models/auth-models';
import { filter, of, switchMap, tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/admin-UI/confirm-dialog/confirm-dialog.component';
import { AdminNotificationService } from '@core/admin-services/admin-notification.service';
import { AuthService } from '@core/admin-services/auth.service';

@Component({
  selector: 'app-my-account',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css',
})
export class MyAccountComponent {
  user?: User;

  userService = inject(UserService);
  authService = inject(AuthService);
  notificationService = inject(AdminNotificationService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialog = inject(MatDialog);

  hideOldPassword = true;
  hideNewPassword = true;
  hideRepeatNewPassword = true;

  accountForm = new FormGroup(
    {
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

        nonNullable: true,
      }),
      oldPassword: new FormControl(
        { value: '', disabled: true },
        {
          validators: [Validators.required],
          nonNullable: true,
        }
      ),
      newPassword: new FormControl(
        { value: '', disabled: true },
        {
          validators: [Validators.required],
          nonNullable: true,
        }
      ),
      repeatedPassword: new FormControl(
        { value: '', disabled: true },
        {
          validators: [Validators.required],
          nonNullable: true,
        }
      ),
    },
    { validators: [this.newPasswordValidator] }
  );

  ngOnInit() {
    this.init();
  }

  init() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const userId = Number(params.get('id'));
          return this.userService.getUserById(userId);
        })
      )
      .subscribe((user) => {
        this.user = user;
        this.accountForm.controls.login.addAsyncValidators(
          this.userService.isUsernameTaken(user.id)
        );
        this.accountForm.patchValue({ name: user.name, login: user.username });
      });
  }

  showChangePassword() {
    if (this.accountForm.controls.oldPassword.disabled) {
      this.accountForm.controls.oldPassword.enable();
      this.accountForm.controls.newPassword.enable();
      this.accountForm.controls.repeatedPassword.enable();
      this.accountForm.controls.oldPassword.reset();
      this.accountForm.controls.newPassword.reset();
      this.accountForm.controls.repeatedPassword.reset();
      return;
    }
    this.accountForm.controls.oldPassword.disable();
    this.accountForm.controls.newPassword.disable();
    this.accountForm.controls.repeatedPassword.disable();
  }

  save() {
    if (this.accountForm.hasError('passwordMismatch')) {
      this.notificationService.openSnackBar(
        'Nieprawidłowo powtórzone hasło',
        'X'
      );
      this.accountForm.controls.repeatedPassword.reset();
      return;
    }
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    if (this.accountForm.pristine) {
      this.accountForm.markAllAsTouched();
      return;
    }

    let isPasswordInputActive$ = of(true);

    if (this.accountForm.controls.oldPassword.enabled) {
      isPasswordInputActive$ = this.authService.checkOldPassword(
        this.user?.id!,
        this.accountForm.controls.oldPassword.value
      );
    }

    isPasswordInputActive$
      .pipe(
        tap((isValid) => {
          if (!isValid) {
            this.notificationService.openSnackBar(
              'Obecne hasło nieprawidłowe',
              'X'
            );
            this.accountForm.controls.oldPassword.reset();
          }
        }),
        filter(Boolean),
        switchMap(() =>
          this.dialog
            .open(ConfirmDialogComponent, {
              width: '300px',
              enterAnimationDuration: '250ms',
              exitAnimationDuration: '150ms',
              data: {
                title: 'Zapisać zmiany?',
                message: 'Wprowadzone zmiany zostaną zapisane.',
                confirmText: 'Zapisz',
                cancelText: 'Anuluj',
              },
            })
            .afterClosed()
        ),
        filter(Boolean),
        switchMap(() => {
          if (this.accountForm.controls.oldPassword.enabled) {
            const user: AuthUser = {
              id: this.user?.id!,
              name: this.accountForm.controls.name.value,
              username: this.accountForm.controls.login.value,
              password: this.accountForm.controls.newPassword.value,
              role: this.user?.role!,
              mustChangePassword: false,
            };

            return this.userService.updateAuthUser(user);
          }

          const user: User = {
            id: this.user?.id!,
            name: this.accountForm.controls.name.value,
            username: this.accountForm.controls.login.value,
            role: this.user?.role!,
          };

          return this.userService.updateUser(user);
        })
      )
      .subscribe(() => {
        this.notificationService.openSnackBar('Zapisano zmiany', 'X');

        this.router.navigate(['/home']);
      });
  }

  cancel() {
    if (this.accountForm.pristine) {
      this.router.navigate(['/home']);
      return;
    }

    this.dialog
      .open(ConfirmDialogComponent, {
        width: '350px',
        enterAnimationDuration: '250ms',
        exitAnimationDuration: '150ms',
        data: {
          title: 'Anulować?',
          message: 'Żadne wprowadzone zmiany, nie zostaną zapisane.',
          confirmText: 'Anuluj',
          cancelText: 'Kontynuuj Edycję',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.router.navigate(['/home']);
          this.notificationService.openSnackBar(
            'Nie zapisano żadnych zmian',
            'X'
          );
        }
      });
  }

  hideOld() {
    this.hideOldPassword = !this.hideOldPassword;
  }
  hideNew() {
    this.hideNewPassword = !this.hideNewPassword;
  }
  hideReapeat() {
    this.hideRepeatNewPassword = !this.hideRepeatNewPassword;
  }

  private newPasswordValidator(form: AbstractControl): ValidationErrors | null {
    const newPassword = form.get('newPassword')?.value;
    const repeatedPassword = form.get('repeatedPassword')?.value;
    if (!newPassword || !repeatedPassword) return null;
    return newPassword === repeatedPassword ? null : { passwordMismatch: true };
  }
}
