import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
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
  getDecksFail, getCardsFromDeck, getCardsFromDeckFail, getCardsFromDeckSuccess,
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
      mergeMap(() => {
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
      mergeMap(() => {
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
      mergeMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            console.log(event);
            return event['event_type'] === 'GET_DECK_RESULT'
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

  public getCardsFromDeck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCardsFromDeck),
      tap(({deck_id}) => this.websocketService.sendGetCardsFromDeckMessage(deck_id)),
      mergeMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            console.log(event);
            return event['event_type'] === 'GET_CARDS_FROM_DECK_RESULT'
          }),
          map((event: any) => getCardsFromDeckSuccess({deck_id: "", deck_cards: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(getCardsFromDeckFail({error: true}))
          })
        )
      })
    )
  );

}
