import { Component, inject } from '@angular/core';
import { UiService } from '../../../core/ui.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MenuService } from '../../../core/menu.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { TranslateDirective, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  UiService = inject(UiService);
  menuService = inject(MenuService);

  inputValue = new FormControl('');
  private sub!: Subscription;
  private wasEmpty = true;

  ngOnInit() {
    this.sub = this.inputValue.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.menuService.searchInputValue.set(value ?? '');

        const isEmpty = value?.length === 0;

        if (this.wasEmpty && !isEmpty) {
          window.scrollTo({
            top: 0,
            behavior: 'instant',
          });
        }
        this.wasEmpty = isEmpty;
      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.menuService.searchInputValue.set('');
  }

  openSearchBar() {
    this.UiService.isSearchBarOpen.update((current) => !current);

    if (!this.UiService.isSearchBarOpen()) {
      this.menuService.searchInputValue.set('');
      this.inputValue.setValue('');
    }
  }
  closeSearchBar() {
    if (!this.inputValue.value) {
      this.menuService.searchInputValue.set('');
      this.UiService.isSearchBarOpen.set(false);
    }
  }
  closeKeyboard() {
    const input = document.activeElement as HTMLElement;
    input.blur();
  }
}
