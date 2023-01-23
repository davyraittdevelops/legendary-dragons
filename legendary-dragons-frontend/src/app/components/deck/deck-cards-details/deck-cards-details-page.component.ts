import {Component, Input} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Store} from '@ngrx/store';
import { Observable } from 'rxjs';
import {AppState} from 'src/app/app.state';
import { DeckType } from 'src/app/models/deck-type.enum';
import {DeckCard} from 'src/app/models/deck.model';
import { isDeckLoadingSelector } from 'src/app/ngrx/deck/deck.selectors';
import {moveDeckCard, removeCardFromDeck} from "../../../ngrx/deck/deck.actions";
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
  @Input('deckCardsLimitReached') deckCardsLimitReached!: boolean;
  deckTypeEnum = DeckType;

  content: any;
  inventory_id!: string;
  isDeckLoading$: Observable<boolean>;

  constructor(public modalService: NgbModal, private appStore: Store<AppState>) {
    this.appStore.select(inventorySelector).subscribe(inventory => this.inventory_id = inventory.inventory_id);
    this.isDeckLoading$ = this.appStore.select(isDeckLoadingSelector);
  }

  open({content}: { content: any }) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
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

  moveDeckCard() {
    if (this.deckType == DeckType.SIDE)
      this.deckType = DeckType.MAIN
    else
     this.deckType = DeckType.SIDE

    this.appStore.dispatch(moveDeckCard({deck_id: this.deckId, deck_card_id: this.card.inventory_card_id, deck_type: this.deckType}));
  }
}
