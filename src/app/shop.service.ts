import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  http = inject(HttpClient);

  getProducts() {
    return this.http.get<Product[]>('https://fakestoreapi.com/products');
  }

  getProduct(productId: number) {
    return this.http.get<Product>(
      `https://fakestoreapi.com/products/${productId}`
    );
  }

  getProductsByCategory(category: string) {
    return this.http.get<Product[]>(
      `https://fakestoreapi.com/products/category/${category}`
    );
  }

  getCategories() {
    return this.http.get<string[]>(
      'https://fakestoreapi.com/products/categories'
    );
  }
}
