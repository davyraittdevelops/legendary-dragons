import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { InventoryCardRequest } from 'src/app/models/inventory.model';
import { QualityEnum } from 'src/app/models/quality.enum';
import { clearSearchResult, searchCardByKeyword, updateCardQuality } from 'src/app/ngrx/card/card.actions';
import { errorSelector, isLoadingSelector, querySelector, searchedCardSelector } from 'src/app/ngrx/card/card.selectors';
import { addCardtoInventory } from 'src/app/ngrx/inventory/inventory.actions';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Card } from "../../../models/card.model";

@Component({
  selector: 'app-add-wishlist-item-component',
  templateUrl: './add-wishlist-item-component.html',
  styleUrls: ['./add-wishlist-item-component.scss']
})

export class AddWishlistItemComponent implements OnInit {
  @Input('inventory_id') inventoryId: string = '';
  searchedCards$: Observable<Card[]>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;
  previousQueryValue: string = "";
  qualityList = QualityEnum;

  selectedQualityValue: string = '';
  scryfall_id: string = ""

  filterValue: string = "";
  displayedColumns: string[] = ['name', 'setName', 'released', 'rarity', 'value','imageUrl', 'addCard'];

  constructor(public modalService: NgbModal, private appStore: Store<AppState>,
              private toastService: ToastService) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);

    this.searchedCards$ = this.appStore.select(searchedCardSelector);
    this.appStore.select(querySelector).subscribe(value => {
      this.previousQueryValue = value
    });
  }

  ngOnInit(): void {
  }

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  searchCardsByKeyword(): void {
    if (this.filterValue.trim() === '' || this.filterValue === this.previousQueryValue)
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
    this.previousQueryValue = "";
    this.appStore.dispatch(clearSearchResult());

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then(
      () => {},
      () => {
      }
    );
  }

  addCardtoInventory(card: Card) {
    this.scryfall_id = card.scryfall_id;

    const inventoryCard: InventoryCardRequest = {
      scryfall_id: card.scryfall_id,
      oracle_id: card.oracle_id,
      card_name: card.card_name,
      mana_cost: card.mana_cost,
      oracle_text: card.oracle_text,
      set_name: card.set_name,
      colors: card.card_faces[0].colors,
      prices: card.prices,
      rarity: card.rarity,
      quality: card.quality ,
      deck_location: "",
      image_url: card.card_faces[0].image_url
    }
    this.appStore.dispatch(addCardtoInventory({inventoryId: this.inventoryId, inventoryCard}))
    this.toastService.showSuccess(`${inventoryCard.card_name} successfully added to the inventory!`);
  }

  selectedQuality(event: any, foundCard: Card) {
    this.appStore.dispatch(updateCardQuality({card: foundCard, quality: event.value}));
  }
}
