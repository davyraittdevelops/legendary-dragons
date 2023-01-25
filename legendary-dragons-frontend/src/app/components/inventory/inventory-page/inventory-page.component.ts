import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Inventory } from 'src/app/models/inventory.model';
import { clearPaginator, getInventory, searchInventoryCard } from 'src/app/ngrx/inventory/inventory.actions';
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
  filterActive: boolean = false;

  constructor(private appStore: Store<AppState>) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.inventory$ = this.appStore.select(inventorySelector).pipe(tap(inv => {
      console.log(inv)
    }));
    this.paginator$ = this.appStore.select(paginatorSelector);
  }

  ngOnInit(): void {
    this.clearFilter();
  }

  navigateToExistingPage(key: PaginatorKey, currentPageIndex: number, selectedIndex: number): void {
    if (currentPageIndex === selectedIndex)
      return;

    this.navigatePage(key);
  }


  navigatePage(key: PaginatorKey): void {
    if (this.filterActive) {
      this.appStore.dispatch(searchInventoryCard(
        {paginatorKey: key, cardName: this.query, filter: {}}
      ));
      return;
    }

    this.appStore.dispatch(getInventory({paginatorKey: key}));
  }

  searchCard(): void {
    if (this.query.trim() === '')
      return;

    this.filterActive = true;
    this.appStore.dispatch(searchInventoryCard(
      {paginatorKey: {}, cardName: this.query, filter: {}}
    ));
  }

  clearFilter(): void {
    this.filterActive = false;
    this.query = '';
    this.appStore.dispatch(clearPaginator());
    this.appStore.dispatch(getInventory({paginatorKey: {}}));
  }
}
