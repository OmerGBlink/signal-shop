import { Component, signal } from '@angular/core';
import { Product } from './product.type';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsDialogComponent } from './product-details-dialog.component';
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
        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            (click)="openProductDetailsDialog(product)"
          >
            View Product
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
})
export class AppComponent {
  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('All');

  constructor(private http: HttpClient, private matDialog: MatDialog) {
    this.getCategories();
    this.getProducts();
  }

  async getProducts() {
    const products = await firstValueFrom(
      this.http.get<Product[]>('https://fakestoreapi.com/products')
    );
    this.products.set(products);
  }

  async getCategories() {
    const categories = await firstValueFrom(
      this.http.get<string[]>('https://fakestoreapi.com/products/categories')
    );
    this.categories.set(['All', ...categories]);
  }

  async getProductsByCategory(category: string) {
    const products = await firstValueFrom(
      this.http.get<Product[]>(
        `https://fakestoreapi.com/products/category/${category}`
      )
    );
    this.products.set(products);
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);

    if (this.selectedCategory() === 'All') {
      this.getProducts();
    } else {
      this.getProductsByCategory(this.selectedCategory());
    }
  }

  async openProductDetailsDialog(p: Product) {
    let product = await firstValueFrom(
      this.http.get<Product>(`https://fakestoreapi.com/products/${p.id}`)
    );

    this.matDialog.open(ProductDetailsDialogComponent, {
      data: { product: signal<Product>(product) },
      width: '500px',
      height: '300px',
    });
  }
}
