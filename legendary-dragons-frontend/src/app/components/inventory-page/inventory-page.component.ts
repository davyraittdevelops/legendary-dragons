import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Inventory } from 'src/app/models/inventory.model';
import { getInventory } from 'src/app/ngrx/inventory/inventory.actions';
import { errorSelector, inventorySelector, isLoadingSelector } from 'src/app/ngrx/inventory/inventory.selectors';
import { Card } from "../../models/card.model";

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss']
})

export class InventoryPageComponent implements OnInit {
  inventory$: Observable<Inventory>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  public CARD_DATA: Card[] = [];

  constructor(private appStore: Store<AppState>) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.inventory$ = this.appStore.select(inventorySelector);
    this.inventory$.pipe(
      tap(data => console.log(data))
    )
  }

  ngOnInit(): void {
    // Todo assign the right inventoryId
    this.appStore.dispatch(getInventory({inventoryId: ""}))
  }
}
