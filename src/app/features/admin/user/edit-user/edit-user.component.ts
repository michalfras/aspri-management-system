import { Component, inject } from '@angular/core';
import { StaffMenuComponent } from '@shared/admin-UI/staff-menu/staff-menu.component';
import { Location } from '@angular/common';
import { UserService } from '@core/user.service';
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
import { ThemeService } from '@core/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/admin-UI/confirm-dialog/confirm-dialog.component';
import { User, UserRole } from '@models/auth-models';

@Component({
  selector: 'app-edit-user',
  imports: [
    StaffMenuComponent,
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

  location = inject(Location);
  route = inject(ActivatedRoute);
  router = inject(Router);

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
    this.themeService.forceLightTheme();
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
      });
  }
  save() {
    if (this.editForm.invalid) return;
    if (this.editForm.pristine) return;

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
        alert('zapisano - popraw to na material');
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
        alert('usunięto użytkownika - popraw to na Material');
        this.router.navigate(['/home']);
      });
  }

  goBack() {
    this.location.back();
  }

  readonly dialog = inject(MatDialog);

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
        }
      });
  }

  ngOnDestroy() {
    this.themeService.loadTheme();
  }
}
