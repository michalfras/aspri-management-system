import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertService } from '@core/alert.service';
import { AuthService } from '@core/auth.service';
import { ValidationMessageComponent } from '@shared/UI-elements/validation-message/validation-message.component';

@Component({
  selector: 'app-login-panel',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './login-panel.component.html',
  styleUrl: './login-panel.component.css',
})
export class LoginPanelComponent {
  authService = inject(AuthService);
  alertService = inject(AlertService);

  loginForm = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
  });

  login() {
    const { username, password } = this.loginForm.getRawValue();
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }
    this.authService.login({
      username: username,
      password: password,
    });
    this.loginForm.controls.password.reset();
  }
  resetControls() {
    this.loginForm.reset();
  }
}
