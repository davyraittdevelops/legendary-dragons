import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { DeckType } from 'src/app/models/deck-type.enum';
import { Filter, Inventory, InventoryCard } from 'src/app/models/inventory.model';
import { addCardToDeck } from 'src/app/ngrx/deck/deck.actions';
import { Paginator, PaginatorKey } from 'src/app/ngrx/inventory/models/inventory-state.model';
import { clearPaginator, searchInventoryCard } from "../../../ngrx/inventory/inventory.actions";
import { inventorySelector, isLoadingSelector, paginatorSelector } from "../../../ngrx/inventory/inventory.selectors";

@Component({
  selector: 'app-add-card-modal',
  templateUrl: './add-card-modal.component.html',
  styleUrls: ['./add-card-modal.component.scss']
})
export class AddCardModalComponent implements OnInit, OnDestroy {
  @Input('deckCardsLimitReached')
  deckCardsLimitReached!: boolean;

  @Input('deckName')
  deckName!: string;

  @Input('deckId')
  deckId!: string;

  inventory$: Observable<Inventory>;
  isSearchLoading$: Observable<boolean>;
  paginator$: Observable<Paginator>;
  deckType = DeckType;

  displayedColumns: string[] = ['Image', 'Name', 'MainDeck', 'SideDeck'];
  cardNameFilter: string = '';
  colorFilter: string = '';
  typeLineFilter: string = '';
  filter: Filter = {deck_location: ''}

  constructor(public modal: NgbActiveModal, private appStore: Store<AppState>) {
    this.inventory$ = this.appStore.select(inventorySelector);
    this.isSearchLoading$ = this.appStore.select(isLoadingSelector);
    this.paginator$ = this.appStore.select(paginatorSelector);
  }

  ngOnInit(): void {
    this.clearFilter();
  }

  ngOnDestroy(): void {
    this.appStore.dispatch(clearPaginator());
  }

  applyFilter() {
    const filter = {...this.filter};

    if (this.colorFilter.trim() !== '')
      filter.colors = [this.colorFilter];

    if (this.typeLineFilter.trim() !== '')
      filter.type_line = this.typeLineFilter;

    this.appStore.dispatch(searchInventoryCard({
      paginatorKey: {}, cardName: this.cardNameFilter.trim(), filter
    }));
  }

  clearFilter(): void {
    this.cardNameFilter = '';
    this.colorFilter = '';
    this.typeLineFilter = '';
    this.filter = {deck_location: ''};
    this.appStore.dispatch(searchInventoryCard({paginatorKey: {}, cardName: '', filter: this.filter}));
    this.appStore.dispatch(clearPaginator());
  }

  addCardToDeck(card: InventoryCard, deckType: string): void {
    this.appStore.dispatch(addCardToDeck({
      deck_id: this.deckId, deck_type: deckType,
      inventory_card: card, deck_name: this.deckName
    }));
    this.modal.close();
  }

  navigateToExistingPage(key: PaginatorKey, currentPageIndex: number, selectedIndex: number): void {
    if (currentPageIndex === selectedIndex)
      return;

    this.navigatePage(key);
  }

  navigatePage(key: PaginatorKey): void {
    this.appStore.dispatch(searchInventoryCard(
      {paginatorKey: key, cardName: this.cardNameFilter.trim(), filter: this.filter}
    ));
  }
}
