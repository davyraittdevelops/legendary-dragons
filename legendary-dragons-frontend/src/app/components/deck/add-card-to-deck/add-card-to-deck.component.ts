import {Component} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Observable} from "rxjs";
import {Inventory, InventoryCard} from "../../../models/inventory.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {
  errorSelector,
  inventorySelector,
  isLoadingSelector
} from "../../../ngrx/inventory/inventory.selectors";
import {Router} from '@angular/router';
import {addCardToDeck} from 'src/app/ngrx/deck/deck.actions';

@Component({
  selector: 'app-add-card-to-deck',
  templateUrl: './add-card-to-deck.component.html',
  styleUrls: ['./add-card-to-deck.component.scss']
})
export class AddCardToDeckComponent {
  inventory$: Observable<Inventory>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;
  displayedColumns: string[] = ['Image', 'Name', 'AddButton'];
  dataSource : any ;
  deck_id = this.router.url.replace("/decks/", "");


  constructor(private appStore: Store<AppState>, public modalService: NgbModal, private router: Router) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.inventory$ = this.appStore.select(inventorySelector);
  }


  ngOnInit(): void {
    // this.appStore.dispatch(getInventory())
  }

  open({content}: { content: any }): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then(
      () => {},
      () => {
      }
    );
  }

  applyFilter(event: Event) {
    // console.log('event', event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addCardToDeck(card: InventoryCard) {
    this.appStore.dispatch(addCardToDeck({deck_id: this.deck_id, deck_type: "main_deck", inventory_card: card}))
  }

  addCardToSideDeck(card: InventoryCard) {
    this.appStore.dispatch(addCardToDeck({deck_id: this.deck_id, deck_type: "side_deck", inventory_card: card}))
  }
}
