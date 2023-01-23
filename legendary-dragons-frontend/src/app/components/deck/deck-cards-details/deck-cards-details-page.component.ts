import {Component, Input} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Store} from '@ngrx/store';
import {AppState} from 'src/app/app.state';
import {DeckCard} from 'src/app/models/deck.model';
import {removeCardFromDeck} from "../../../ngrx/deck/deck.actions";
import {inventorySelector} from "../../../ngrx/inventory/inventory.selectors";

@Component({
  selector: 'app-deck-cards-details-page',
  templateUrl: './deck-cards-details-page.component.html',
  styleUrls: ['./deck-cards-details-page.component.scss']
})

export class DeckCardsDetailsPageComponent {
  @Input() card!: DeckCard;
  @Input('deckId') deckId!: string;
  @Input('deckType') deckType!: string;
  content: any;
  inventory_id!: string;

  constructor(public modalService: NgbModal, private appStore: Store<AppState>) {
    this.appStore.select(inventorySelector).subscribe(inventory => this.inventory_id = inventory.inventory_id);
  }

  open({content}: { content: any }) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
  }

  displayAvailablePrice(prices: any): string {
    let price = "Price not available";

    if (prices.eur !== null) {
      price = `€ ${prices.eur}`;
    } else if (prices.usd !== null) {
      price = `$ ${prices.usd}`;
    } else if (prices.tix !== null) {
      price = `${prices.tix} TIX`;
    }

    return price;
  }

  removeCardFromDeck() {
    this.appStore.dispatch(removeCardFromDeck({deck_id: this.deckId, deck_card: this.card, deck_type: this.deckType, inventory_id: this.inventory_id}));
  }
}
