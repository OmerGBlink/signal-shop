import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-category-list',
  template: `
    <ng-container *ngFor="let category of categories">
      <button
        *ngIf="category !== selectedCategory; else selectedBtn"
        color="primary"
        mat-stroked-button
        (click)="categorySelected.emit(category)"
      >
        {{ category }}
      </button>

      <ng-template #selectedBtn>
        <button
          color="primary"
          mat-raised-button
          (click)="categorySelected.emit(category)"
        >
          {{ category }}
        </button>
      </ng-template>
    </ng-container>
  `,
  styles: [],
})
export class CategoryListComponent {
  @Input() categories: string[] = [];
  @Input() selectedCategory: string = 'All';
  @Output() categorySelected = new EventEmitter<string>();
}
