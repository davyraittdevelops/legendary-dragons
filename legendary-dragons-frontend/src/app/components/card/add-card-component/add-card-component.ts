import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { InventoryCard } from 'src/app/models/inventory.model';
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
  searchedCards$: Observable<Card[]>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  private closeResult: string = '';
  private filterValue: string = '';

  displayedColumns: string[] = ['name', 'released', 'set', 'rarity', 'value', 'imageUrl', 'addCard'];

  constructor(public modalService: NgbModal, private appStore: Store<AppState>) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.searchedCards$ = this.appStore.select(searchedCardSelector);
  }

  ngOnInit(): void {

  }
  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  searchCardsByKeyword(): void {
    if (this.filterValue.trim() === '')
      return;

    this.appStore.dispatch(searchCardByKeyword({query: this.filterValue}))
  }

  formatSetType(setType: string): string {
    return setType.toLowerCase().replace("_", " ");
  }

  displayAvailablePrice(prices: any): string {
    let price = "Price not available";

    if (prices.eur !== null) {
      price = "€" + prices.eur;
    } else if (prices.usd !== null) {
      price = "$" + prices.usd;
    } else if (prices.tix !== null) {
      price = "TIX: " + prices.tix;
    }

    return price;
  }

  open({content}: { content: any }): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addCardtoInventory(inventoryCard: InventoryCard) {
    // Todo assign the right inventoryID
    this.appStore.dispatch(addCardtoInventory({inventoryId: "", inventoryCard: inventoryCard}))
    console.log(inventoryCard)
  }
}
