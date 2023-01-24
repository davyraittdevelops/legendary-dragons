import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { DeckType } from 'src/app/models/deck-type.enum';
import { addCardToDeck } from 'src/app/ngrx/deck/deck.actions';
import { isAddCardLoadingSelector } from 'src/app/ngrx/deck/deck.selectors';
import { AppState } from "../../../app.state";
import { Inventory, InventoryCard } from "../../../models/inventory.model";
import { searchInventoryCard } from "../../../ngrx/inventory/inventory.actions";
import { errorSelector, inventorySelector, isLoadingSelector } from "../../../ngrx/inventory/inventory.selectors";

interface Filter {
  deck_location?: string;
  colors?: string[];
  type_line?: string;
}

@Component({
  selector: 'app-add-card-to-deck',
  templateUrl: './add-card-to-deck.component.html',
  styleUrls: ['./add-card-to-deck.component.scss']
})
export class AddCardToDeckComponent {
  @Input('deck_name') deckName: string = '';

  inventory$: Observable<Inventory>;
  isLoading$: Observable<boolean>;
  isSearchLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  displayedColumns: string[] = ['Image', 'Name', 'MainDeck', 'SideDeck'];
  deckId: string = '';

  cardNameFilter: string = '';
  colorFilter: string = '';
  typeLineFilter: string = '';
  filter: Filter = {deck_location: ''}

  constructor(private appStore: Store<AppState>, public modalService: NgbModal,
              private activatedRoute: ActivatedRoute) {
    this.isLoading$ = this.appStore.select(isAddCardLoadingSelector);
    this.isSearchLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.inventory$ = this.appStore.select(inventorySelector);
  }

  ngOnInit(): void {
    this.clearFilter();
    this.activatedRoute.params.subscribe(params => {
      this.deckId = params["id"];
    });
  }

  open({content}: { content: any }): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
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

  addCardToDeck(card: InventoryCard) {
    this.appStore.dispatch(addCardToDeck({deck_id: this.deckId, deck_type: DeckType.MAIN, inventory_card: card, deck_name: this.deckName}));
    this.modalService.dismissAll();
  }

  addCardToSideDeck(card: InventoryCard) {
    this.appStore.dispatch(addCardToDeck({deck_id: this.deckId, deck_type: DeckType.SIDE, inventory_card: card, deck_name: this.deckName}));
    this.modalService.dismissAll();
  }

  clearFilter(): void {
    this.cardNameFilter = '';
    this.colorFilter = '';
    this.typeLineFilter = '';
    this.filter = {deck_location: ''};
    this.appStore.dispatch(searchInventoryCard({paginatorKey: {}, cardName: '', filter: this.filter}));
  }
}
