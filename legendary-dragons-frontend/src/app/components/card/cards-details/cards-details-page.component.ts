import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { InventoryCard } from 'src/app/models/inventory.model';
import { removeCardFromInventory } from 'src/app/ngrx/inventory/inventory.actions';
import {Observable} from "rxjs";
import {WishlistAlert} from "../../../models/wishlist.model";
import {errorSelector, isLoadingSelector} from "../../../ngrx/inventory/inventory.selectors";
import {alertItemsSelector} from "../../../ngrx/wishlist/wishlist.selectors";
import {cardDetailSelector} from "../../../ngrx/card/card.selectors";
import {getAlerts} from "../../../ngrx/wishlist/wishlist.actions";
import {getCard} from "../../../ngrx/card/card.actions";
import {CardDetail} from "../../../models/card.model";
@Component({
  selector: 'app-cards-details-page',
  templateUrl: './cards-details-page.component.html',
  styleUrls: ['./cards-details-page.component.scss']
})

export class CardsDetailsPageComponent {
  @Input('inventory_id') inventoryId: string = '';
  @Input() card!: InventoryCard;
  content: any;
  card_details$: Observable<CardDetail>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  constructor(public modalService: NgbModal, private appStore: Store<AppState>) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.card_details$ = this.appStore.select(cardDetailSelector);
  }


  open({content}: { content: any }) {
    this.appStore.dispatch(getCard({scryfall_id: this.card.scryfall_id}))
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
  }

  displayAvailablePrice(prices: any): string {
    let price = '€ 0.00';

    if (prices.eur !== null) {
      price = `€ ${prices.eur}`;
    } else if (prices.usd !== null) {
      price = `$ ${prices.usd}`;
    } else if (prices.tix !== null) {
      price = `${prices.tix} TIX`;
    }

    return price;
  }

  removeCardFromInventory(inventoryCardId: string) {
    this.appStore.dispatch(removeCardFromInventory({inventoryCardId: inventoryCardId, inventoryId: this.inventoryId}));
  }
}
