import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { catchError, Observable, of, share } from "rxjs";
import { logoutUser } from 'src/app/ngrx/user/user.actions';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { AppState } from "../../../app.state";
import { Deck } from "../../../models/deck.model";
import { getDeck } from "../../../ngrx/deck/deck.actions";
import { deckByIdSelector, errorSelector, isAddCardLoadingSelector, isLoadingSelector } from "../../../ngrx/deck/deck.selectors";
import {DeckType} from "../../../models/deck-type.enum";

@Component({
  selector: 'app-decks-details-page',
  templateUrl: './decks-details-page.component.html',
  styleUrls: ['./decks-details-page.component.scss']
})
export class DecksDetailsPageComponent implements OnInit {
  selectedDeck$: Observable<Deck>;
  isLoading$: Observable<boolean>;
  isAddCardLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;
  DeckType = DeckType;

  deckId: string = "";

  constructor(public modalService: NgbModal, private appStore: Store<AppState>, private activatedRoute: ActivatedRoute,
              private websocketService : WebsocketService, private router: Router) {
    this.selectedDeck$ = this.appStore.select(deckByIdSelector);
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.isAddCardLoading$ = this.appStore.select(isAddCardLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
  }

  ngOnInit(): void {
    this.websocketService.dataUpdates$().pipe(
      share(),
      catchError((error) => {
        // Token expired
        if (!('reason' in error)) {
          this.appStore.dispatch(logoutUser());

          // TODO: Not working correctly..
          this.router.navigate(["/login"]);
        }

        return of(error);
      })
    ).subscribe();

    this.activatedRoute.params.subscribe(params => {
      this.deckId = params["id"];
      this.appStore.dispatch(getDeck({deck_id: this.deckId}));
    });
  }
}
