import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from '@ngrx/store';
import { Observable} from 'rxjs';
import { AppState } from 'src/app/app.state';
import { InventoryCardRequest } from 'src/app/models/inventory.model';
import { clearSearchResult, searchCardByKeyword } from 'src/app/ngrx/card/card.actions';
import { errorSelector, isLoadingSelector, querySelector, searchedCardSelector } from 'src/app/ngrx/card/card.selectors';
import { CardState } from 'src/app/ngrx/card/models/card-state.model';
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
  previousQuery$: Observable<string>;
  previousQueryValue: string = "";
  qualityEmpty = false;
  quality: string = "";
  scryfall_id: string = "";
  qualityList: string[] = [
    "Mint",
    "Near Mint",
    "Excellent",
    "Good",
    "Light Played",
    "Played",
    "Poor"
  ];

  filterValue: string = "";
  displayedColumns: string[] = ['name', 'setName', 'released', 'rarity', 'value','imageUrl', 'addCard'];

  constructor(public modalService: NgbModal, private appStore: Store<AppState>) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);

    this.searchedCards$ = this.appStore.select(searchedCardSelector);
    this.previousQuery$ = this.appStore.select(querySelector);
  }

  ngOnInit(): void {
    this.previousQuery$.subscribe(value => {
      this.previousQueryValue = value;
    })
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
    this.appStore.dispatch(clearSearchResult());

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then(
      () => {},
      () => {
      }
    );
  }

  addCardtoInventory(card: Card) {
    console.log(this.quality)

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
      quality: this.quality,
      deck_location: "",
      image_url: card.card_faces[0].image_url
    }

    this.scryfall_id = inventoryCard.scryfall_id;

    if (!inventoryCard.quality) {
      this.qualityEmpty = true;
      return;
    }
    this.appStore.dispatch(addCardtoInventory({inventoryId: this.inventoryId, inventoryCard}))
  }

  selectedQuality(value: any, element: any) {
    this.qualityEmpty = false;
    this.quality = value;
  }
}
