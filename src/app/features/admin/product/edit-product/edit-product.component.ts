import { Component, inject } from '@angular/core';
import { ProductFormData } from '@models/product-model';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '@core/shared-services/language.service';
import { ProductService } from '@core/admin-services/product.service';

@Component({
  selector: 'app-edit-product',
  imports: [ProductFormComponent],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent {
  productService = inject(ProductService);
  route = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  productFormData?: ProductFormData;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.productService.getProductById(id).subscribe((product) => {
      this.productFormData = product;
    });
  }
}
