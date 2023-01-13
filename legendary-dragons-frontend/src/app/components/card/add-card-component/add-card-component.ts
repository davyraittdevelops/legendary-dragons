import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { InventoryCardRequest } from 'src/app/models/inventory.model';
import { searchCardByKeyword } from 'src/app/ngrx/card/card.actions';
import { errorSelector, isLoadingSelector, searchedCardSelector } from 'src/app/ngrx/card/card.selectors';
import { addCardtoInventory } from 'src/app/ngrx/inventory/inventory.actions';
import { inventorySelector } from 'src/app/ngrx/inventory/inventory.selectors';
import { Card } from "../../../models/card.model";

@Component({
  selector: 'app-add-card-component',
  templateUrl: './add-card-component.html',
  styleUrls: ['./add-card-component.scss']
})

export class AddCardComponent implements OnInit {
  @Input('inventory_id') inventoryId: string = '';

  searchedCards$: Observable<Card[]>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  private filterValue: string = '';
  displayedColumns: string[] = ['name', 'setName', 'released', 'rarity', 'value','imageUrl', 'addCard'];

  constructor(public modalService: NgbModal, private appStore: Store<AppState>) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);

    this.searchedCards$ = this.appStore.select(searchedCardSelector);

  }

  ngOnInit(): void {}

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  searchCardsByKeyword(): void {
    if (this.filterValue.trim() === '')
      return;

    this.appStore.dispatch(searchCardByKeyword({query: this.filterValue}))
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

  open({content}: { content: any }): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then(
      () => {},
      () => {
        // Maybe clear search result with an ngrx action
      }
    );
  }

  addCardtoInventory(card: Card) {
    const inventoryCard: InventoryCardRequest = {
      scryfall_id: card.scryfall_id,
      oracle_id: card.oracle_id,
      card_name: card.card_name,
      colors: card.card_faces[0].colors,
      prices: card.prices,
      rarity: card.rarity,
      quality: "",
      deck_location: "",
      image_url: card.card_faces[0].image_url
    }

    this.appStore.dispatch(addCardtoInventory({inventoryId: this.inventoryId, inventoryCard}))
  }
}
