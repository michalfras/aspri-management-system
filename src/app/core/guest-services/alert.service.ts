import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  isAlertActive = signal<boolean>(false);

  alertMessage = signal<string>('');
  alertColor = signal<'green' | 'red' | 'blue'>('green');

  private timeoutId: any;

  showAlert(alertText: string, color?: 'green' | 'red' | 'blue') {
    color ? this.alertColor.set(color) : this.alertColor.set('green');
    this.alertMessage.set(alertText);
    if (this.isAlertActive()) {
      this.isAlertActive.set(false);
      setTimeout(() => this.isAlertActive.set(true), 150);
    } else this.isAlertActive.set(true);

    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.isAlertActive.set(false);
      this.alertMessage.set('');
    }, 2000);
  }
}
