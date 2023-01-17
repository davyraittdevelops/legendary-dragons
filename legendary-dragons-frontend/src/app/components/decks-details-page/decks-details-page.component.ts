import { Component, OnInit } from '@angular/core';
import {Card} from "../../models/card.model";
import {Observable} from "rxjs";
import {Inventory} from "../../models/inventory.model";
import {inventorySelector} from "../../ngrx/inventory/inventory.selectors";
import {Deck} from "../../models/deck.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.state";
import {decksSelector, errorSelector, isLoadingSelector} from "../../ngrx/deck/deck.selectors";
import {getCardsFromDeck, getDecks} from "../../ngrx/deck/deck.actions";
import {Router} from "@angular/router";
import {getInventory} from "../../ngrx/inventory/inventory.actions";


@Component({
  selector: 'app-decks-details-page',
  templateUrl: './decks-details-page.component.html',
  styleUrls: ['./decks-details-page.component.scss']
})
export class DecksDetailsPageComponent implements OnInit {

  decks$: Observable<Deck[]>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  constructor(public modalService: NgbModal, private appStore: Store<AppState>,  private router: Router) {
    this.decks$ = this.appStore.select(decksSelector);
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);


  }

  public sideDecks: Card[] = [];

  public decks: Card[] = [];

  ngOnInit(): void {
    const deck_id = this.router.url.replace("/decks/", "");
    this.appStore.dispatch(getCardsFromDeck({deck_id: deck_id}));
  }

}
