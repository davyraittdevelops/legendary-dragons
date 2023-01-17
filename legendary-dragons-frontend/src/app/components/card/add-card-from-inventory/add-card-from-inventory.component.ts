import { Component } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {clearSearchResult} from "../../../ngrx/card/card.actions";
import {Observable} from "rxjs";
import {Inventory} from "../../../models/inventory.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {errorSelector, inventorySelector, isLoadingSelector} from "../../../ngrx/inventory/inventory.selectors";
import {getInventory} from "../../../ngrx/inventory/inventory.actions";
import {MatTableDataSource} from "@angular/material/table";
import {Card} from "../../../models/card.model";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-card-from-inventory',
  templateUrl: './add-card-from-inventory.component.html',
  styleUrls: ['./add-card-from-inventory.component.scss']
})
export class AddCardFromInventoryComponent {
  inventory$: Observable<Inventory>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;
  displayedColumns: string[] = ['Image', 'Name', 'AddButton'];
  dataSource : any ;


  constructor(private appStore: Store<AppState>, public modalService: NgbModal, private router: Router) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.inventory$ = this.appStore.select(inventorySelector);
  }


  ngOnInit(): void {
    this.appStore.dispatch(getInventory())
    let deckID = this.router.url.replace("/decks/", "");
    console.log(deckID);

  }

  open({content}: { content: any }): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then(
      () => {},
      () => {
      }
    );
  }

  applyFilter(event: Event) {
    console.log('event', event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addCardToDeck(card: Card) {
    console.log('selected card, card', card)

  }

  addCardToSideDeck(card: Card) {
    console.log('selected card, card', card)
  }
}
