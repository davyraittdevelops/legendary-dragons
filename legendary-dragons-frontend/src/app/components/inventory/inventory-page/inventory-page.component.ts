import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Inventory } from 'src/app/models/inventory.model';
import { getInventory } from 'src/app/ngrx/inventory/inventory.actions';
import { errorSelector, inventorySelector, isLoadingSelector } from 'src/app/ngrx/inventory/inventory.selectors';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss']
})

export class InventoryPageComponent implements OnInit {
  inventory$: Observable<Inventory>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  activePage: number = 0;

  constructor(private appStore: Store<AppState>) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.inventory$ = this.appStore.select(inventorySelector);
  }

  ngOnInit(): void {
    this.appStore.dispatch(getInventory())
  }

  public handlePageEvent(event: number): number {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });

    this.activePage = event;
    return event;
  }
}
