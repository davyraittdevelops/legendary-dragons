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
import { getInventory } from "../../../ngrx/inventory/inventory.actions";
import { errorSelector, inventorySelector } from "../../../ngrx/inventory/inventory.selectors";

@Component({
  selector: 'app-add-card-to-deck',
  templateUrl: './add-card-to-deck.component.html',
  styleUrls: ['./add-card-to-deck.component.scss']
})
export class AddCardToDeckComponent {
  @Input('deck_name') deckName: string = '';

  inventory$: Observable<Inventory>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  displayedColumns: string[] = ['Image', 'Name', 'MainDeck', 'SideDeck'];
  dataSource : any ;
  deckId: string = '';

  constructor(private appStore: Store<AppState>, public modalService: NgbModal,
              private activatedRoute: ActivatedRoute) {
    this.isLoading$ = this.appStore.select(isAddCardLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.inventory$ = this.appStore.select(inventorySelector);
  }

  ngOnInit(): void {
    this.appStore.dispatch(getInventory({paginatorKey: {}}));

    this.activatedRoute.params.subscribe(params => {
      this.deckId = params["id"];
    });
  }

  availableCards(inventoryCards: InventoryCard[]): InventoryCard[] {
    return inventoryCards.filter((card) => card.deck_location === '');
  }

  open({content}: { content: any }): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addCardToDeck(card: InventoryCard) {
    this.appStore.dispatch(addCardToDeck({deck_id: this.deckId, deck_type: DeckType.MAIN, inventory_card: card, deck_name: this.deckName}));
    this.modalService.dismissAll();
  }

  addCardToSideDeck(card: InventoryCard) {
    this.appStore.dispatch(addCardToDeck({deck_id: this.deckId, deck_type: DeckType.SIDE, inventory_card: card, deck_name: this.deckName}));
    this.modalService.dismissAll();
  }
}
