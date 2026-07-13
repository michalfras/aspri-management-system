import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '@core/admin-services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '@core/shared-services/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/admin-UI/confirm-dialog/confirm-dialog.component';
import { User, UserRole } from '@models/auth-models';
import { AdminNotificationService } from '@core/admin-services/admin-notification.service';

@Component({
  selector: 'app-edit-user',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent {
  themeService = inject(ThemeService);
  userService = inject(UserService);
  notificationService = inject(AdminNotificationService);

  location = inject(Location);
  route = inject(ActivatedRoute);
  router = inject(Router);

  readonly dialog = inject(MatDialog);

  editedUserId!: number;

  editForm = new FormGroup({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ],
      nonNullable: true,
    }),
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ],
      nonNullable: true,
    }),
    role: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        switchMap((paramAsUserId) =>
          this.userService.getUserById(paramAsUserId)
        )
      )
      .subscribe((user) => {
        this.editedUserId = user.id;
        this.editForm.patchValue({
          name: user.name,
          username: user.username,
          role: user.role,
        });
        this.editForm.controls.username.setAsyncValidators(
          this.userService.isUsernameTaken(this.editedUserId)
        );
      });
  }
  save() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    if (this.editForm.pristine) {
      this.editForm.markAllAsTouched();
      return;
    }

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
      .pipe(
        filter(Boolean),
        switchMap(() => {
          const user: User = {
            id: this.editedUserId,
            name: this.editForm.controls.name.value,
            username: this.editForm.controls.username.value,
            role: this.editForm.controls.role.value as UserRole,
          };

          return this.userService.updateUser(user);
        })
      )
      .subscribe(() => {
        this.notificationService.openSnackBar('Zapisano zmiany', 'X');
        this.router.navigate(['/home']);
      });
  }

  deleteUser() {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '300px',
        enterAnimationDuration: '250ms',
        exitAnimationDuration: '150ms',
        data: {
          title: 'Usunąć użytkownika?',
          message: 'Nastąpi trwałe usunięcie profilu.',
          confirmText: 'Usuń',
          cancelText: 'Anuluj',
        },
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => {
          return this.userService.deleteUser(this.editedUserId);
        })
      )
      .subscribe(() => {
        this.notificationService.openSnackBar('Użytkownik Usunięty', 'X');
        this.router.navigate(['/home']);
      });
  }

  cancel() {
    if (this.editForm.pristine) {
      this.router.navigate(['/home']);
      return;
    }

    this.dialog
      .open(ConfirmDialogComponent, {
        width: '300px',
        enterAnimationDuration: '250ms',
        exitAnimationDuration: '150ms',
        data: {
          title: 'Anulować edycję?',
          message: 'Wprowadzone zmiany nie zostaną zapisane.',
          confirmText: 'Anuluj i cofnij',
          cancelText: 'Kontynuuj edycję',
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

  goBack() {
    this.location.back();
  }
}
