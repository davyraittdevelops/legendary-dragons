import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Inventory } from 'src/app/models/inventory.model';
import { getInventory } from 'src/app/ngrx/inventory/inventory.actions';
import { errorSelector, inventorySelector, isLoadingSelector, paginatorSelector } from 'src/app/ngrx/inventory/inventory.selectors';
import { PaginatorKey, Paginator } from 'src/app/ngrx/inventory/models/inventory-state.model';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss']
})
export class InventoryPageComponent implements OnInit {
  inventory$: Observable<Inventory>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;
  paginator$: Observable<Paginator>;

  query: string = '';

  constructor(private appStore: Store<AppState>) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.inventory$ = this.appStore.select(inventorySelector);
    this.paginator$ = this.appStore.select(paginatorSelector);
  }

  ngOnInit(): void {
    this.appStore.dispatch(getInventory({paginatorKey: {}}))
  }

  navigateToExistingPage(key: PaginatorKey, currentPageIndex: number, selectedIndex: number): void {
    if (currentPageIndex === selectedIndex)
      return;

    this.navigatePage(key);
  }


  navigatePage(key: PaginatorKey): void {
    this.appStore.dispatch(getInventory({paginatorKey: key}));
  }

  searchCard(name: string): void {
    if (name.trim() === '')
      return;

    console.log(name);
  }
}
