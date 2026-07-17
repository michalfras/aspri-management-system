import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductData, ProductFormData } from '@models/product-model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);

  getProductById(id: string) {
    return this.http.get<ProductData>(`${environment.apiUrl}/products/${id}`);
  }

  addProduct(product: ProductFormData) {
    return this.http.post<ProductData>(
      `${environment.apiUrl}/products`,
      product
    );
  }
  updateProduct(product: ProductFormData, id: number) {
    return this.http.patch<ProductData>(
      `${environment.apiUrl}/products/${id}`,
      product
    );
  }
  deleteProduct(id: number) {
    return this.http.delete<void>(`${environment.apiUrl}/products/${id}`);
  }
  hideProduct(id: number, isHidden: boolean) {
    return this.http.patch<ProductData>(
      `${environment.apiUrl}/products/${id}`,
      { isHidden: isHidden }
    );
  }
}
