import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { DeckCard } from 'src/app/models/deck.model';
import { InventoryCard } from 'src/app/models/inventory.model';
import { removeCardFromInventory } from 'src/app/ngrx/inventory/inventory.actions';
@Component({
  selector: 'app-deck-cards-details-page',
  templateUrl: './deck-cards-details-page.component.html',
  styleUrls: ['./deck-cards-details-page.component.scss']
})

export class DeckCardsDetailsPageComponent {
  @Input() card!: DeckCard;
  content: any;

  constructor(public modalService: NgbModal, private appStore: Store<AppState>) {
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
}
