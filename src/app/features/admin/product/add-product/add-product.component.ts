import { Component, inject } from '@angular/core';
import { ProductFormComponent } from '../product-form/product-form.component';
import {
  Category,
  ProductFormData,
  Subcategories,
} from '@models/product-model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [ProductFormComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  route = inject(ActivatedRoute);

  productFormData?: ProductFormData;

  ngOnInit() {
    const category = this.route.snapshot.queryParamMap.get(
      'category'
    ) as Category;
    const subcategory = this.route.snapshot.queryParamMap.get(
      'subcategory'
    ) as Subcategories;

    this.productFormData = {
      nameKey: 'ADMIN_DATA',
      price: 0,
      category: category,
      subcategory: subcategory,
      isPopular: false,
      forcePopup: false,
    };
  }
}
