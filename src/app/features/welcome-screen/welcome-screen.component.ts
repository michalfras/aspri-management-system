import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageFlagsComponent } from '../../shared/language-flags/language-flags.component';
import { LanguageService } from '../../core/language.service';
import { UiService } from '../../core/ui.service';

import { Router } from '@angular/router';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-welcome-screen',
  imports: [TranslateModule, LanguageFlagsComponent],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.css',
})
export class WelcomeScreenComponent {
  languageService = inject(LanguageService);
  UiService = inject(UiService);
  themeService = inject(ThemeService);
  router = inject(Router);

  step = signal<number>(0);
  isWheelVisible = false;
  closeWelcomeScreen = false;

  items = [
    '言語を選択',
    'Wybierz Język',
    'Choose Language',
    'Виберіть мову',
    'Sprache Wählen',
  ];
  currentIndex = 0;
  text1 = 'Sprache Wählen';
  text2 = '言語を選択';
  text3 = 'Wybierz Język';
  text4 = 'Choose Language';
  text5 = 'Виберіть мову';

  @ViewChild('slot1') slot1!: ElementRef;
  @ViewChild('slot2') slot2!: ElementRef;
  @ViewChild('slot3') slot3!: ElementRef;
  @ViewChild('slot4') slot4!: ElementRef;
  @ViewChild('slot5') slot5!: ElementRef;

  ngOnInit() {
    this.startWheel();
  }

  startWheel() {
    setInterval(() => {
      this.slot1.nativeElement.classList.remove('no-transition');
      this.slot2.nativeElement.classList.remove('no-transition');
      this.slot3.nativeElement.classList.remove('no-transition');
      this.slot4.nativeElement.classList.remove('no-transition');

      this.slot1.nativeElement.classList.add('move');
      this.slot2.nativeElement.classList.add('move');
      this.slot2.nativeElement.classList.remove('highlight');
      this.slot3.nativeElement.classList.add('move');
      this.slot3.nativeElement.classList.add('highlight');
      this.slot4.nativeElement.classList.add('move');

      setTimeout(() => {
        this.slot1.nativeElement.classList.remove('move');
        this.slot2.nativeElement.classList.remove('move');
        this.slot3.nativeElement.classList.remove('move');
        this.slot4.nativeElement.classList.remove('move');

        this.slot1.nativeElement.classList.add('no-transition');
        this.slot2.nativeElement.classList.add('no-transition');
        this.slot2.nativeElement.classList.add('highlight');
        this.slot3.nativeElement.classList.add('no-transition');
        this.slot3.nativeElement.classList.remove('highlight');
        this.slot4.nativeElement.classList.add('no-transition');
      }, 500);

      setTimeout(() => {
        this.text1 = this.items[this.currentIndex % this.items.length];
        this.text2 = this.items[(this.currentIndex + 1) % this.items.length];
        this.text3 = this.items[(this.currentIndex + 2) % this.items.length];
        this.text4 = this.items[(this.currentIndex + 3) % this.items.length];
        this.text5 = this.items[(this.currentIndex + 4) % this.items.length];
        this.currentIndex++;
      }, 500);
    }, 2000);
  }

  nextStep() {
    this.step.update((n) => n + 1);
    if (this.step() >= 1) {
      this.isWheelVisible = true;
    }
  }
  scrollDown() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }
  selectStyle(style: 'dark' | 'light' | 'auto') {
    this.themeService.setTheme(style);
    this.UiService.visited.set(true);
    localStorage.setItem('visited', 'true');

    setTimeout(() => {
      this.closeWelcomeScreen = true;
      setTimeout(() => {
        this.router.navigate(['/home']);
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 800);
    }, 500);
  }
}
