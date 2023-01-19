import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { addCardToDeck } from 'src/app/ngrx/deck/deck.actions';
import { AppState } from "../../../app.state";
import { Inventory, InventoryCard } from "../../../models/inventory.model";
import { getInventory } from "../../../ngrx/inventory/inventory.actions";
import { errorSelector, inventorySelector, isLoadingSelector } from "../../../ngrx/inventory/inventory.selectors";

@Component({
  selector: 'app-add-card-to-deck',
  templateUrl: './add-card-to-deck.component.html',
  styleUrls: ['./add-card-to-deck.component.scss']
})
export class AddCardToDeckComponent {
  inventory$: Observable<Inventory>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;
  displayedColumns: string[] = ['Image', 'Name', 'MainDeck', 'SideDeck'];
  dataSource : any ;
  deck_id: string = '';

  constructor(private appStore: Store<AppState>, public modalService: NgbModal, private activatedRoute: ActivatedRoute) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.inventory$ = this.appStore.select(inventorySelector);
  }

  ngOnInit(): void {
    this.appStore.dispatch(getInventory());

    this.activatedRoute.params.subscribe(params => {
      this.deck_id = params["id"];
    });
  }

  open({content}: { content: any }): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then(
      () => {},
      () => {}
    );
  }

  applyFilter(event: Event) {
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
