import { Component, Input } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeckCard } from 'src/app/models/deck.model';

@Component({
  selector: 'app-deck-cards-details-page',
  templateUrl: './deck-cards-details-page.component.html',
  styleUrls: ['./deck-cards-details-page.component.scss']
})
export class DeckCardsDetailsPageComponent {
  @Input() card!: DeckCard;
  content: any;


  constructor(public modalService: NgbModal) {
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
}
