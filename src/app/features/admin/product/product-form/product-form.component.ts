import { DialogModule } from '@angular/cdk/dialog';
import { Component, Inject, inject, Input } from '@angular/core';
import {
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { AdminNotificationService } from '@core/admin-services/admin-notification.service';
import { ProductService } from '@core/admin-services/product.service';
import { MenuService } from '@core/guest-services/menu.service';
import { LanguageService } from '@core/shared-services/language.service';
import {
  BADGE_OPTIONS,
  BadgeOptions,
  Category,
  ProductFormData,
  Subcategories,
  SUBCATEGORY_ADMIN_OPTIONS,
} from '@models/product-model';
import { ConfirmDialogComponent } from '@shared/admin-UI/confirm-dialog/confirm-dialog.component';
import { filter, Subscription, switchMap } from 'rxjs';
@Component({
  selector: 'app-product-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatOption,
    MatSelect,
    MatRadioModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent {
  @Input({ required: true }) product!: ProductFormData;
  @Input({ required: true }) mode!: 'editMode' | 'addMode';

  readonly languageService = inject(LanguageService);
  readonly productService = inject(ProductService);
  readonly notificationService = inject(AdminNotificationService);
  readonly menuService = inject(MenuService);
  readonly router = inject(Router);
  readonly dialog = inject(MatDialog);

  private sub!: Subscription;
  private sub1!: Subscription;
  subcategoryAdmin = SUBCATEGORY_ADMIN_OPTIONS;
  badgeOptions = BADGE_OPTIONS;

  form = new FormGroup({
    enableAllLang: new FormControl<boolean>(false, { nonNullable: true }),
    enableEnLang: new FormControl<boolean>(false, { nonNullable: true }),
    enableGerLang: new FormControl<boolean>(false, { nonNullable: true }),
    enableJpnLang: new FormControl<boolean>(false, { nonNullable: true }),
    enableUkrLang: new FormControl<boolean>(false, { nonNullable: true }),

    plName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    enName: new FormControl<string>('', { nonNullable: true }),
    gerName: new FormControl<string>('', { nonNullable: true }),
    jpnName: new FormControl<string>('', { nonNullable: true }),
    ukrName: new FormControl<string>('', { nonNullable: true }),

    plShortInfo: new FormControl<string>('', { nonNullable: true }),
    enShortInfo: new FormControl<string>('', { nonNullable: true }),
    gerShortInfo: new FormControl<string>('', { nonNullable: true }),
    jpnShortInfo: new FormControl<string>('', { nonNullable: true }),
    ukrShortInfo: new FormControl<string>('', { nonNullable: true }),

    plInfo: new FormControl<string>('', { nonNullable: true }),
    enInfo: new FormControl<string>('', { nonNullable: true }),
    gerInfo: new FormControl<string>('', { nonNullable: true }),
    jpnInfo: new FormControl<string>('', { nonNullable: true }),
    ukrInfo: new FormControl<string>('', { nonNullable: true }),

    price: new FormControl<number>(0, { nonNullable: true }),
    category: new FormControl<Category | ''>(''),
    subcategory: new FormControl<Subcategories | ''>(''),

    hasOptions: new FormControl<boolean>(false, { nonNullable: true }),
    optionsContainer: new FormArray<FormGroup>([]),

    hasBadge: new FormControl<boolean>(false, { nonNullable: true }),
    selectedBadge: new FormControl<BadgeOptions | ''>(''),
    isPopular: new FormControl<boolean>(false, { nonNullable: true }),
    forcePopup: new FormControl<boolean>(false, { nonNullable: true }),
    showInfoInMenu: new FormControl<boolean>(false, { nonNullable: true }),
  });

  ngOnInit() {
    this.init();
  }

  async init() {
    this.sub = this.form.controls.enableAllLang.valueChanges.subscribe(
      (value) => {
        this.selectAllLang(value);
      }
    );
    this.sub1 = this.form.controls.hasOptions.valueChanges.subscribe(
      (value) => {
        if (value) {
          this.addChoiceInput();
          this.addChoiceInput();
          this.form.controls.forcePopup.setValue(true);
          this.form.controls.forcePopup.disable();
        } else {
          this.choicesArr.clear();
          this.form.controls.forcePopup.setValue(false);
          this.form.controls.forcePopup.enable();
        }
      }
    );

    const plName = await this.languageService.getAdminFormTranslatedName(
      this.product,
      'pl'
    );
    const enName = await this.languageService.getAdminFormTranslatedName(
      this.product,
      'en'
    );
    const gerName = await this.languageService.getAdminFormTranslatedName(
      this.product,
      'ger'
    );
    const jpnName = await this.languageService.getAdminFormTranslatedName(
      this.product,
      'jpn'
    );
    const ukrName = await this.languageService.getAdminFormTranslatedName(
      this.product,
      'ukr'
    );
    const plInfo = await this.languageService.getAdminFormTranslatedInfo(
      this.product,
      'pl'
    );
    const enInfo = await this.languageService.getAdminFormTranslatedInfo(
      this.product,
      'en'
    );
    const gerInfo = await this.languageService.getAdminFormTranslatedInfo(
      this.product,
      'ger'
    );
    const jpnInfo = await this.languageService.getAdminFormTranslatedInfo(
      this.product,
      'jpn'
    );
    const ukrInfo = await this.languageService.getAdminFormTranslatedInfo(
      this.product,
      'ukr'
    );
    const plShortInfo =
      await this.languageService.getAdminFormTranslatedShortInfo(
        this.product,
        'pl'
      );
    const enShortInfo =
      await this.languageService.getAdminFormTranslatedShortInfo(
        this.product,
        'en'
      );
    const gerShortInfo =
      await this.languageService.getAdminFormTranslatedShortInfo(
        this.product,
        'ger'
      );
    const jpnShortInfo =
      await this.languageService.getAdminFormTranslatedShortInfo(
        this.product,
        'jpn'
      );
    const ukrShortInfo =
      await this.languageService.getAdminFormTranslatedShortInfo(
        this.product,
        'ukr'
      );

    this.form.patchValue({
      plName: plName,
      enName: enName,
      gerName: gerName,
      jpnName: jpnName,
      ukrName: ukrName,

      plInfo: plInfo,
      enInfo: enInfo,
      gerInfo: gerInfo,
      jpnInfo: jpnInfo,
      ukrInfo: ukrInfo,

      plShortInfo: plShortInfo,
      enShortInfo: enShortInfo,
      gerShortInfo: gerShortInfo,
      jpnShortInfo: jpnShortInfo,
      ukrShortInfo: ukrShortInfo,

      price: this.product.price,
      category: this.product.category,
      subcategory: this.product.subcategory,
      hasOptions: this.product.choices?.length ? true : false,

      hasBadge: !!this.product.badge,
      selectedBadge: this.product.badge ?? '',
      isPopular: !!this.product.isPopular,
      forcePopup: !!this.product.forcePopup,
      showInfoInMenu: !!this.product.showInfoInMenu,
    });

    if (!this.product.choices) return;
    this.choicesArr.clear();
    this.product.choices.forEach(async (choice) => {
      const translatedChoicePl =
        (await this.languageService.getAdminFormTranslatedChoice(
          choice,
          'pl'
        )) ?? '';
      const translatedChoiceEn =
        (await this.languageService.getAdminFormTranslatedChoice(
          choice,
          'en'
        )) ?? '';
      const translatedChoiceGer =
        (await this.languageService.getAdminFormTranslatedChoice(
          choice,
          'ger'
        )) ?? '';
      const translatedChoiceJpn =
        (await this.languageService.getAdminFormTranslatedChoice(
          choice,
          'jpn'
        )) ?? '';
      const translatedChoiceUkr =
        (await this.languageService.getAdminFormTranslatedChoice(
          choice,
          'ukr'
        )) ?? '';

      this.choicesArr.push(
        new FormGroup({
          optionLabelKey: new FormControl(choice.labelKey),
          optionTextPl: new FormControl(translatedChoicePl),
          optionTextEn: new FormControl(translatedChoiceEn),
          optionTextGer: new FormControl(translatedChoiceGer),
          optionTextJpn: new FormControl(translatedChoiceJpn),
          optionTextUkr: new FormControl(translatedChoiceUkr),
          price: new FormControl(choice.price),
        })
      );
    });
  }

  addChoiceInput() {
    const choice = new FormGroup({
      optionLabelKey: new FormControl(''),
      optionTextPl: new FormControl('', { validators: [Validators.required] }),
      optionTextEn: new FormControl(''),
      optionTextGer: new FormControl(''),
      optionTextJpn: new FormControl(''),
      optionTextUkr: new FormControl(''),
      price: new FormControl<number>(0, { nonNullable: true }),
    });
    this.choicesArr.push(choice);
  }
  deleteChoiceInput(index: number) {
    this.choicesArr.removeAt(index);
  }

  get choicesArr() {
    return this.form.controls.optionsContainer;
  }

  private selectAllLang(value: boolean) {
    this.form.patchValue({
      enableEnLang: value,
      enableGerLang: value,
      enableJpnLang: value,
      enableUkrLang: value,
    });
  }

  addProduct() {
    if (this.form.invalid || this.form.pristine) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      this.notificationService.openSnackBar('Uzupełnij brakujące dane');
      this.form.markAllAsTouched();
      return;
    }

    this.dialog
      .open(ConfirmDialogComponent, {
        width: '300px',
        enterAnimationDuration: '250ms',
        exitAnimationDuration: '150ms',
        data: {
          title: 'Dodać Produkt?',
          message: 'Wprowadzone informacje o produkcie zostaną zapisane.',
          confirmText: 'Dodaj Produkt',
          cancelText: 'Anuluj',
        },
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => {
          const product: ProductFormData = this.createProductFromForm();
          console.log(
            product.choices?.length,
            'DLUGOSC TABLICY po zrobieniu produktu'
          );
          console.log(product, 'DANE RODUKTU po zrobieniu produktu ');
          return this.productService.addProduct(product);
        })
      )
      .subscribe(() => {
        this.menuService.loadAllMenuProducts();
        this.notificationService.openSnackBar('Dodano nowy Produkt', 'X');
        this.router.navigate(['/home']);
      });
  }

  updateProduct() {
    if (this.form.invalid || this.form.pristine) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      this.notificationService.openSnackBar('Uzupełnij brakujące dane');
      this.form.markAllAsTouched();
      return;
    }

    this.dialog
      .open(ConfirmDialogComponent, {
        width: '300px',
        enterAnimationDuration: '250ms',
        exitAnimationDuration: '150ms',
        data: {
          title: 'Zapisać zmiany?',
          message: 'Wszystkie wprowadzone zmiany, zostaną zapisane.',
          confirmText: 'Zapisz',
          cancelText: 'Anuluj',
        },
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => {
          const product: ProductFormData = this.createProductFromForm();
          const productId = this.product.id!;
          return this.productService.updateProduct(product, productId);
        })
      )
      .subscribe(() => {
        this.menuService.loadAllMenuProducts();
        this.notificationService.openSnackBar('Zapisano zmiany', 'X');
        this.router.navigate(['/home']);
      });
  }

  cancelEditing() {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '350px',
        enterAnimationDuration: '250ms',
        exitAnimationDuration: '150ms',
        data: {
          title: 'Anulować?',
          message: 'Wszystkie wprowadzone zmiany, zostaną utracone.',
          confirmText: 'Anuluj i wyjdź',
          cancelText: `Kontynuuj ${
            this.mode === 'editMode' ? 'edycję' : 'dodawanie'
          }`,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.notificationService.openSnackBar(
            `Anulowano ${
              this.mode === 'editMode'
                ? 'edycję produktu'
                : 'dodawanie nowego produktu'
            }`,
            'X'
          );
          this.router.navigate(['/home']);
        }
        return;
      });
  }

  deleteProduct() {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '300px',
        enterAnimationDuration: '250ms',
        exitAnimationDuration: '150ms',
        data: {
          title: 'Usunąć Produkt?',
          message: 'Produkt zostanie trwale usunięty!',
          confirmText: 'Usuń produkt',
          cancelText: 'Anuluj',
          confirmButtonClass: 'danger',
        },
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => {
          const productId = this.product.id as number;
          return this.productService.deleteProduct(productId);
        })
      )
      .subscribe(() => {
        this.menuService.loadAllMenuProducts();
        this.notificationService.openSnackBar('Usunięto Produkt', 'X');
        this.router.navigate(['/home']);
      });
  }

  createProductFromForm(): ProductFormData {
    return {
      nameKey: this.product.nameKey,
      infoKey: this.product.infoKey,
      shortInfoKey: this.product.shortInfoKey,
      price: this.form.controls.price.value,
      image: this.product.image,

      adminName: {
        pl: this.form.controls.plName.value,
        en: this.form.controls.enName.value,
        ger: this.form.controls.gerName.value,
        jpn: this.form.controls.jpnName.value,
        ukr: this.form.controls.ukrName.value,
      },
      adminInfo: {
        pl: this.form.controls.plInfo.value,
        en: this.form.controls.enInfo.value,
        ger: this.form.controls.gerInfo.value,
        jpn: this.form.controls.jpnInfo.value,
        ukr: this.form.controls.ukrInfo.value,
      },
      adminShortInfo: {
        pl: this.form.controls.plShortInfo.value,
        en: this.form.controls.enShortInfo.value,
        ger: this.form.controls.gerShortInfo.value,
        jpn: this.form.controls.jpnShortInfo.value,
        ukr: this.form.controls.ukrShortInfo.value,
      },

      category: this.product.category,
      subcategory: this.product.subcategory,
      badge: this.form.controls.selectedBadge.value as BadgeOptions,
      isPopular: this.form.controls.isPopular.value,
      forcePopup: this.form.controls.forcePopup.value,
      showInfoInMenu: this.form.controls.showInfoInMenu.value,
      ...(this.choicesArr.length > 0 && {
        choices: this.choicesArr.value.map((choice) => {
          return {
            labelKey: choice.optionLabelKey,
            adminLabel: {
              pl: choice.optionTextPl,
              en: choice.optionTextEn,
              ger: choice.optionTextGer,
              jpn: choice.optionTextJpn,
              ukr: choice.optionTextUkr,
            },
            price: choice.price,
          };
        }),
      }),
    };
  }

  // deleteUser() {
  //   this.dialog
  //     .open(ConfirmDialogComponent, {
  //       width: '300px',
  //       enterAnimationDuration: '250ms',
  //       exitAnimationDuration: '150ms',
  //       data: {
  //         title: 'Usunąć użytkownika?',
  //         message: 'Nastąpi trwałe usunięcie profilu.',
  //         confirmText: 'Usuń',
  //         cancelText: 'Anuluj',
  //       },
  //     })
  //     .afterClosed()
  //     .pipe(
  //       filter(Boolean),
  //       switchMap(() => {
  //         return this.userService.deleteUser(this.editedUserId);
  //       })
  //     )
  //     .subscribe(() => {
  //       this.notificationService.openSnackBar('Użytkownik Usunięty', 'X');
  //       this.router.navigate(['/home']);
  //     });
  // }

  // cancel() {
  //   if (this.editForm.pristine) {
  //     this.router.navigate(['/home']);
  //     return;
  //   }

  //   this.dialog
  //     .open(ConfirmDialogComponent, {
  //       width: '300px',
  //       enterAnimationDuration: '250ms',
  //       exitAnimationDuration: '150ms',
  //       data: {
  //         title: 'Anulować edycję?',
  //         message: 'Wprowadzone zmiany nie zostaną zapisane.',
  //         confirmText: 'Anuluj i cofnij',
  //         cancelText: 'Kontynuuj edycję',
  //       },
  //     })
  //     .afterClosed()
  //     .subscribe((confirmed) => {
  //       if (confirmed) {
  //         this.router.navigate(['/home']);
  //         this.notificationService.openSnackBar('Anulowano Edycję', 'X');
  //       }
  //     });
  // }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.sub1?.unsubscribe();
  }
}
