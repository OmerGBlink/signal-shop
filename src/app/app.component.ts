import { Component, effect, OnInit, signal } from '@angular/core';
import { Product } from './product.type';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <app-category-list
      *effect
      class="categories"
      [categories]="categories()"
      [selectedCategory]="selectedCategory()"
      (categorySelected)="selectCategory($event)"
    ></app-category-list>

    <div *effect class="grid">
      <mat-card *ngFor="let product of products()" class="example-card">
        <mat-card-header>
          <mat-card-title>{{ product.title }}</mat-card-title>
        </mat-card-header>
        <img mat-card-image [src]="product.image" />
      </mat-card>
    </div>
  `,
})
export class AppComponent {
  products = signal<Product[]>([]);
  categories = signal<string[]>([]);

  selectedCategory = signal<string>('All');

  constructor(private http: HttpClient) {
    this.getCategories();
    this.getProducts();
  }

  getProducts() {
    firstValueFrom(
      this.http.get<Product[]>('https://fakestoreapi.com/products')
    ).then((products) => this.products.set(products));
  }

  getCategories() {
    firstValueFrom(
      this.http.get<string[]>('https://fakestoreapi.com/products/categories')
    ).then((categories) => this.categories.set(['All', ...categories]));
  }

  getProductsByCategory(category: string) {
    firstValueFrom(
      this.http.get<Product[]>(
        `https://fakestoreapi.com/products/category/${category}`
      )
    ).then((products) => {
      this.products.set(products);
    });
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);

    if (this.selectedCategory() === 'All') {
      this.getProducts();
    } else {
      this.getProductsByCategory(this.selectedCategory());
    }
  }
}
