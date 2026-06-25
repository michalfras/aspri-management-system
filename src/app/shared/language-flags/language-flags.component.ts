import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/language.service';
import { UiService } from '../../core/ui.service';

@Component({
  selector: 'app-language-flags',
  imports: [CommonModule, TranslateModule],
  templateUrl: './language-flags.component.html',
  styleUrl: './language-flags.component.css',
})
export class LanguageFlagsComponent {
  lang = inject(LanguageService);
  UiService = inject(UiService);

  changeLang(lang: string) {
    if (lang === 'pl') {
      this.UiService.isPolishTranslationVisible.set(false);
    }
    this.lang.setLang(lang);
  }
}
