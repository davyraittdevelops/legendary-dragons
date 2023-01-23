import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { WebsocketService } from "src/app/services/websocket/websocket.service";

import {
  createDeck,
  createDeckSuccess,
  createDeckFail,
  removeDeck,
  removeDeckSuccess,
  removeDeckFail,
  getDecks,
  getDecksSuccess,
  getDecksFail,
  getDeck,
  getDeckFail,
  getDeckSuccess,
  addCardToDeck,
  addCardToDeckFail,
  addCardToDeckSuccess,
  removeCardFromDeck,
  removeCardFromDeckFail,
  removeCardFromDeckSuccess
} from "./deck.actions";

@Injectable()
export class DeckEffects {

  constructor(
    private readonly actions$: Actions,
    private readonly websocketService: WebsocketService,
  ) { }

  public addCardtoInventoryEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createDeck),
      tap(({deck_name, deck_type}) => this.websocketService.sendCreateDeckMessage(deck_name, deck_type)),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'INSERT_DECK_RESULT'
          }),
          map((event: any) => createDeckSuccess({deck: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(createDeckFail({error: true}))
          })
        )
      })
    )
  );

  public removeDeckEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeDeck),
      tap(({deck_id}) => this.websocketService.sendRemoveDeckMessage(deck_id)),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'REMOVE_DECK_RESULT'
          }),
          map((event: any) => removeDeckSuccess({deck: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(removeDeckFail({error: true}))
          })
        )
      })
    )
  );


  public getDecksEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDecks),
      tap(() => this.websocketService.sendGetDecksMessage()),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'GET_DECKS_RESULT'
          }),
          map((event: any) => getDecksSuccess({decks: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(getDecksFail({error: true}))
          })
        )
      })
    )
  );

  public getDeckEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDeck),
      tap(({deck_id}) => {
        this.websocketService.sendGetDeckMessage(deck_id)
      }),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'GET_DECK_RESULT'
          }),
          map((event: any) => {
            const deck = event["data"]["deck"];
            deck.deck_cards = event["data"]["deck_cards"];
            deck.side_deck_cards = event["data"]["side_deck_cards"];
            return getDeckSuccess({deck})
          }),
          catchError((error) => {
            console.log(error);
            return of(getDeckFail({error: true}))
          })
        )
      })
    )
  );

  public addCardtoDeckEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCardToDeck),
      tap(({deck_id, deck_type, inventory_card, deck_name}) => this.websocketService.sendAddCardToDeckMessage(deck_id, deck_type, inventory_card, deck_name)),
      switchMap(({deck_type}) => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'INSERT_DECK_CARD_RESULT' || event['event_type'] === 'INSERT_SIDE_DECK_CARD_RESULT'
          }),
          map((event: any) => addCardToDeckSuccess({deckCard: event["data"], deckType: deck_type})),
          catchError((error) => {
            console.log(error);
            return of(addCardToDeckFail({error: true}))
          })
        )
      })
    )
  );

  public removeCardFromDeckEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCardFromDeck),
      tap(({deck_id, deck_card, inventory_id}) => this.websocketService.sendRemoveCardFromDeckMessage(deck_id, deck_card, inventory_id)),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'REMOVE_DECK_CARD_RESULT' || event['event_type'] === 'REMOVE_SIDE_DECK_CARD_RESULT'
          }),
          map((event: any) => removeCardFromDeckSuccess({deck_id: event["deck_id"], deck_card: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(removeCardFromDeckFail({error: true}))
          })
        )
      })
    )
  );

}
