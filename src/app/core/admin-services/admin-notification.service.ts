import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AdminNotificationService {
  private _snackBar = inject(MatSnackBar);

  openSnackBar(text: string, btnText?: string, duration?: number) {
    const durationTime = duration ? duration * 1000 : 5000;
    return this._snackBar.open(text, btnText, {
      duration: durationTime,
    });
  }
}
