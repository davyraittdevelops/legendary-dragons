import { Component, OnInit } from '@angular/core';
import {Card} from "../../../models/card.model";
import {Observable, tap} from "rxjs";
import {Inventory} from "../../../models/inventory.model";
import {inventorySelector} from "../../../ngrx/inventory/inventory.selectors";
import {Deck} from "../../../models/deck.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {deckByIdSelector, decksSelector, errorSelector, isLoadingSelector} from "../../../ngrx/deck/deck.selectors";
import {getCardsFromDeck, getDecks} from "../../../ngrx/deck/deck.actions";
import {ActivatedRoute, Router} from "@angular/router";
import {getInventory} from "../../../ngrx/inventory/inventory.actions";
import { WebsocketService } from 'src/app/services/websocket/websocket.service';


@Component({
  selector: 'app-decks-details-page',
  templateUrl: './decks-details-page.component.html',
  styleUrls: ['./decks-details-page.component.scss']
})
export class DecksDetailsPageComponent implements OnInit {
  selectedDeck$: Observable<Deck>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;
  deck_id: string = ""

  constructor(public modalService: NgbModal, private appStore: Store<AppState>, private activatedRoute: ActivatedRoute, private websocketService : WebsocketService,) {
    this.selectedDeck$ = this.appStore.select(deckByIdSelector).pipe(tap(selectedDeck => {
      console.log(selectedDeck)
    }));

    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);

  }

  ngOnInit(): void {
    this.websocketService.dataUpdates$().subscribe(() => {})

    this.activatedRoute.params.subscribe(params => {
      this.deck_id = params["id"];
      this.appStore.dispatch(getCardsFromDeck({deck_id: this.deck_id}));
    });
  }
}
